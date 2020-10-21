import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from "react-native";
import CalendarComponent from "./CalendarComponent";
import { Api, JsonRpc } from "eosjs-rn";
import { JsSignatureProvider } from "eosjs-rn/dist/eosjs-jssig";
import { Picker } from "@react-native-community/picker";
import { Types } from "../data";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import moment from "moment";
import { connect } from "react-redux";
import Snackbar from "react-native-snackbar";
import AWS from "aws-sdk";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import {B} from '../components';
const { TextEncoder, TextDecoder } = require("text-encoding");
const defaultPrivateKey = "5K6FsMBtaNEvbFMaJbqNruSoKWoe5vLcZA8QEX6br3BxQhQp6cK"; // bob
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
const rpc = new JsonRpc("https://jungle2.cryptolions.io:443", { fetch });
const api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
});


const ses = new AWS.SES({
  accessKeyId: "AKIAXQFEMNA4AWKM4HW5",
  secretAccessKey: "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",
  region: "eu-west-1",
  apiVersion: "2010-12-01",
});

const snack = (msg, color = "red") => {
  Snackbar.show({
    text: `${msg}`,
    textColor: color,
    backgroundColor: "white",
    duration: Snackbar.LENGTH_INDEFINITE,
    action: {
      text: "UNDO",
      textColor: "rgb(0, 103, 187)",
      onPress: () => {
        Snackbar.dismiss();
      },
    },
  });
};


const validation = (email) => {
  const email_trimmed = email.toLowerCase().trim();
  if (email_trimmed == "") {
    snack("Email cannot be empty.");
    return false;
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,8}$/i.test(email_trimmed)
  ) {
    snack("Email format is not valid.");
    return false;
  } else {
    return true;
  }
};


var radio_props = [
  { label: "positive", value: 1 },
  { label: "negative", value: 0 },
];

class InsertUser extends Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);

    this.state = {
      patientEmail: "",
      testId: "",
      testType: "",
      testLabel: "",
      issueDate: moment(new Date()).format("YYYY-MM-DD"),
      checkBoxes: [],
      isPending: false,
      userId: ""
    };
  }

  issue = async (dataParams, email) => {
    try {
      if (dataParams.testId && email ) {
        firestore()
          .collection("users")
          .where("email", "==", email)
          .get()
          .then((res) => {
            if (res.docs.length == 0) {
              //user dont exist, so register him, and add him to database.
              const defaultNum = Math.floor(100000 + Math.random() * 900000); //6 digits default number

              auth()
                .createUserWithEmailAndPassword(
                  email,
                  defaultNum.toString()
                )
                .then((data) => {
                  firestore()
                    .collection("users")
                    .doc(data.user.uid)
                    .set({
                      email: email,
                      one_time_password: defaultNum,
                      stepSeen: false,
                      id: data.user.uid,
                      role: "user"
                    });

                  // update userId with the id of the new created user
                  // this.setState({userId: data.user.uid});
                  let id = data.user.uid;
                  //send email with his code.
                  var TemplateData = {
                    passwrod: defaultNum,
                  };

                  var params = {
                    Source: "info@cometogether.network",
                    Destination: {
                      ToAddresses: [email],
                    },
                    Template: "BackTogetherLoginPassword" /* required */,
                    TemplateData: JSON.stringify(TemplateData) /* required */,
                  };

                  ses
                    .sendTemplatedEmail(params)
                    .promise()
                    .then(() => {
                      //redirect to 'email sent page'
                    });
                  
                  firestore()
                  .collection("tests")
                  .add({
                    userId:  id, 
                    ...dataParams,
                  })
                  .then(() => {
                    this.setState({ isPending: false });
                    snack("User has been created! & Test issued successfully", "green");
                  });
                })
                .catch((error) => {
                  if (error.code === "auth/invalid-email") {
                    snack("That email address is invalid!");
                    this.setState({ wait: false });
                  }
                  this.setState({ wait: false });
                  console.log(error);
                });
            }
            else {
              let id = res.docs[0].id;
              firestore()
              .collection("tests")
              .add({
                userId:  id, 
                ...dataParams,
              })
              .then(() => {
                this.setState({ isPending: false });
                snack("Test issued successfully", "green");
              });
            }
          });
      } else {
        snack("Please fill all the test information");
      }
    } catch (e) {
      snack("Certificate was not issued!");
      this.setState({ isPending: false });
    }
  };



  handlePatientEmail = (text) => {
    this.setState({ patientEmail: text });
  };
  handleTestId = (text) => {
    this.setState({ testId: text });
  };

  issueCertificate = async () => {
    try {
      let data;

      // If validation is wrong display error message and do nothing
      if (!validation(this.state.patientEmail)) return;

      data = {
        testId: this.state.testId,
        testType: this.state.testLabel,
        result: this.state.checkBoxes[0].value === 1,
        issueDate: this.state.issueDate,
        issuer: this.props.userToken.email.toLowerCase().trim(),
        authorityName: this.props.userToken.healthCenter,
        adminId: "",
        status: 'pending',
      };

      if (!this.state.isPending) {
        this.setState({ isPending: true });
        await this.issue(data, this.state.patientEmail.toLowerCase().trim());
      }
    } catch (e) {
      snack("Certificate was not issued!");
      this.setState({ isPending: false });
    }
  };



  render() {
    if(this.state.isPending){ 
      return(         
        <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#efeff5'}}>
          <B>
            <Text style={{color: 'rgb(0, 103, 187)', fontSize: 18, marginBottom: 5}}>Issuing the Test. . .</Text>
          </B>
          <ActivityIndicator size='large' color='rgb(0, 103, 187)' />
        </View>
      )
    }
    else {
      return (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ backgroundColor: "#efeff5" }}>
            <Text style={styles.title}>Issue Certificate</Text>

            <Text style={styles.label}>Patient email</Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="e.g. patient@gmail.com"
              placeholderTextColor="grey"
              autoCapitalize="none"
              onChangeText={(text) => this.handlePatientEmail(text)}
            />

            <Text style={styles.label}>Test ID</Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="e.g. 1234"
              placeholderTextColor="grey"
              autoCapitalize="none"
              onChangeText={(text) => this.handleTestId(text)}
            />

            <Text style={styles.label}>Test Type</Text>
            <View style={styles.typeDropdown}>
              <Picker
                selectedValue={this.state.testType}
                style={{ height: 40, marginBottom: Platform.OS === 'ios' ? 150 : 0}}
                itemStyle={{ fontSize: 16 }}
                onValueChange={(itemValue) => {
                  if (itemValue !== 0) {
                    this.setState({ testType: itemValue });
                    let checkBoxes = [];
                    Types.forEach((testType) => {
                      if (testType.value === itemValue) {
                        checkBoxes = testType.checkBoxes;
                        this.setState({ testLabel: testType.label });
                      }
                    });
                    this.setState({ checkBoxes: checkBoxes });
                  }
                }}
              >
                <Picker.Item
                  style={{ color: "dimgrey" }}
                  key={0}
                  label="Please select..."
                  value={0}
                />

                {Types.map((type) => {
                  return (
                    <Picker.Item
                      key={type.value}
                      label={type.label}
                      value={type.value}
                    />
                  );
                })}
              </Picker>
            </View>

            {this.state.checkBoxes.map((checkBox, index) => {
              return (
                <View style={styles.typeCheckbox} key={checkBox.label}>
                  <Text style={styles.radioBtnLabel}>{checkBox.label}</Text>
                  <RadioForm formHorizontal={true} animation={true}>
                    {radio_props.map((obj, i) => (
                      <RadioButton labelHorizontal={false} key={i}>
                        <RadioButtonInput
                          obj={obj}
                          index={i}
                          isSelected={checkBox.value === obj.value}
                          onPress={(value) => {
                            let checkBoxes = this.state.checkBoxes;
                            checkBoxes[index].value = value;
                            this.setState({ checkBoxes: checkBoxes });
                          }}
                          borderWidth={2}
                          buttonInnerColor={"rgb(0,103,187)"}
                          buttonOuterColor={"rgb(0,103,187)"}
                          buttonSize={20}
                          buttonOuterSize={40}
                          buttonStyle={{}}
                          buttonWrapStyle={{}}
                        />
                        <RadioButtonLabel
                          obj={obj}
                          index={i}
                          labelStyle={{ fontSize: 14 }}
                          labelWrapStyle={{}}
                        />
                      </RadioButton>
                    ))}
                  </RadioForm>
                </View>
              );
            })}
            <Text style={styles.label}>Issuance Date</Text>
            <CalendarComponent
              typeOfDate="issueDate"
              maxDate={new Date()}
              current={new Date()}
              sendData={this.getData}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => this.issueCertificate()}
            >
              <Text style={styles.submitButtonText}> Submit </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }
  }
  getData(val) {
    try {
      this.setState({ [val.typeOfDate]: val.date });
    } catch (e) {}
  }
}

const mapStateToProps = (state) => ({
  userToken: state.auth.userToken,
});

export default connect(mapStateToProps)(InsertUser);

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginTop: 15,
  },
  input: {
    marginHorizontal: 18,
    marginTop: 2,
    backgroundColor: "white",
    height: 40,
    borderRadius: 10,
    paddingLeft: 8
  },
  typeDropdown: {
    marginHorizontal: 18,
    marginBottom: 2,
    backgroundColor: "white",
    borderRadius: 10,
  },
  typeCheckbox: {
    marginLeft: 18,
  },
  label: {
    marginLeft: 18,
    color: "dimgrey",
    marginTop: 20,
    fontSize: 16,
  },
  radioBtnLabel: {
    marginTop: 5,
    color: "dimgrey",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "rgb(0,103,187)",
    marginHorizontal: 18,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "white",
    margin: "auto",
    textAlign: "center",
  },
});
