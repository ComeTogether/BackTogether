import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-community/picker";
import { DropdownRoles } from "../data";
import AWS from "aws-sdk";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { connect } from "react-redux";
import Snackbar from "react-native-snackbar";

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
    duration: Snackbar.LENGTH_SHORT,
    action: {
      text: "UNDO",
      textColor: "rgb(0, 103, 187)",
      onPress: () => {
        Snackbar.dismiss();
      },
    },
  });
};

class InsertRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: "",
      role: "",
      roleLabel: "",
      wait: false,
    };
  }

  validation = () => {
    const email_trimmed = this.state.userEmail.toLowerCase().trim();
    if (email_trimmed == "") {
      snack("Email cannot be empty.");
      return true;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,8}$/i.test(email_trimmed)
    ) {
      snack("Email format is not valid.");
      return true;
    } else if (this.state.roleLabel == "") {
      snack("Please choose a role.");
      return true;
    } else {
      return false;
    }
  };

  handleUserEmail = (text) => {
    this.setState({ userEmail: text });
  };

  setRole = () => {
    const validate = this.validation();
    if (validate) return;
    //check if user exists in our database already
    const email_trimmed = this.state.userEmail.toLowerCase().trim();
    const role = this.state.roleLabel.toLowerCase().trim();
    this.setState({ wait: true });
    firestore()
      .collection("users")
      .where("email", "==", email_trimmed)
      .get()
      .then((doc) => {
        if (!doc.empty) {
          let usersData = doc.docs[0].data();
          //change only if user has specific role
          if (
            (usersData.role === "user" || usersData.role === "health") &&
            (usersData.healthCenter === undefined ||
              usersData.healthCenter === this.props.userToken.healthCenter)
          ) {
            firestore()
              .collection("users")
              .doc(doc.docs[0].ref.id)
              .update({
                role: role,
                healthCenter: this.props.userToken.healthCenter,
              });
            this.setState({ wait: false });
            snack("User's role has been updated!", "green");
          }else {
            this.setState({ wait: false });
            snack("You don't have the permission to change user's role!", "red");
          }
        } else {
          //user dont exist, so register him, and add him to database.
          const defaultNum = Math.floor(100000 + Math.random() * 900000); //6 digits default number

          auth()
            .createUserWithEmailAndPassword(
              email_trimmed,
              defaultNum.toString()
            )
            .then((data) => {
              firestore()
                .collection("users")
                .doc(data.user.uid)
                .set({
                  email: email_trimmed,
                  one_time_password: defaultNum,
                  stepSeen: false,
                  id: data.user.uid,
                  role: role,
                  healthCenter: this.props.userToken.healthCenter
                });

              //send email with his code.
              var TemplateData = {
                passwrod: defaultNum,
              };

              var params = {
                Source: "info@cometogether.network",
                Destination: {
                  ToAddresses: [email_trimmed],
                },
                Template: "BackTogetherLoginPassword" /* required */,
                TemplateData: JSON.stringify(TemplateData) /* required */,
              };

              ses
                .sendTemplatedEmail(params)
                .promise()
                .then(() => {
                  //redirect to 'email sent page'
                  this.setState({ wait: false });
                  snack("User has been created!", "green");
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
      });
  };

  render() {
    if (this.state.wait) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "efeff5",
          }}
        >
          <ActivityIndicator size="large" color="rgb(0, 103, 187)" />
        </View>
      );
    } else
      return (
        <View style={{ flex: 1, backgroundColor: "#efeff5" }}>
          <ScrollView contentContainerStyle={{ backgroundColor: "#efeff5" }}>
            <Text style={styles.title}>Set User's Role</Text>

            <Text style={styles.label}>User's email</Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="e.g. user@gmail.com"
              placeholderTextColor="grey"
              autoCapitalize="none"
              onChangeText={(text) => this.handleUserEmail(text)}
            />

            <Text style={styles.label}>Role</Text>
            <View style={styles.typeDropdown}>
              <Picker
                selectedValue={this.state.role}
                style={{ height: Platform.OS === 'ios' ? 200 : 40 }}
                onValueChange={(itemValue) => {
                  console.log(itemValue);
                  DropdownRoles.forEach((item) => {
                    if (item.value == itemValue) {
                      this.setState({ role: itemValue });
                      this.setState({ roleLabel: item.label });
                    }
                  });
                }}
              >
                <Picker.Item key={0} label="Please select..." value={0} />

                {DropdownRoles.map((type) => {
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

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => this.setRole()}
            >
              <Text style={styles.submitButtonText}> Submit </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
  }
}

const mapStateToProps = (state) => ({
  userToken: state.auth.userToken,
});

export default connect(mapStateToProps)(InsertRole);

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
    padding: 8
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
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: "rgb(0,103,187)",
    marginHorizontal: 18,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    margin: "auto",
    textAlign: "center",
  },
});
