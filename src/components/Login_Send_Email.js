import React from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";

import AWS from "aws-sdk";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Snackbar from "react-native-snackbar";
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_API_VERSION,
} from "@env";

const ses = new AWS.SES({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
  apiVersion: AWS_API_VERSION,
});

export default function Login_Send_Email({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [wait, setWait] = React.useState(false);
  const [title, setTitle] = React.useState(true);

  const snack = (msg) => {
    Snackbar.show({
      text: `${msg}`,
      textColor: "red",
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

  const validation = React.useCallback(() => {
    const email_trimmed = email.toLowerCase().trim();
    if (email_trimmed == "") {
      snack("Email cannot be empty.");
      return true;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,8}$/i.test(email_trimmed)
    ) {
      snack("Email format is not valid.");
      return true;
    } else {
      return false;
    }
  });

  const sendEmail = () => {
    const validate = validation();
    if (validate) return;
    //check if user exists in our database already
    const email_trimmed = email.toLowerCase().trim();
    setWait(true);

    const defaultNum = Math.floor(100000 + Math.random() * 900000); //6 digits default number

    auth()
      .createUserWithEmailAndPassword(email_trimmed, defaultNum.toString())
      .then((data) => {
        firestore()
          .collection("users")
          .doc(data.user.uid)
          .set({
            email: email_trimmed,
            stepSeen: false,
            id: data.user.uid,
            role: "user",
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
            setWait(false);
            navigation.navigate("EmailSent");
          });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          snack(
            "That email address is already in use! If you don't remember your password, please reset it."
          );
          setWait(false);
        }

        if (error.code === "auth/invalid-email") {
          snack("That email address is invalid!");
          setWait(false);
        }
        setWait(false);
        console.log(error);
      });
  };

  if (wait) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", backgroundColor: "efeff5" }}
      >
        <ActivityIndicator size="large" color="rgb(0, 103, 187)" />
      </View>
    );
  } else
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../../images/BT_logoWithName.png")}
          resizeMode="contain"
        />
        {title && <Text style={styles.header}> One-Time Password</Text>}
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Submit your email</Text>

          <TextInput
            autoCorrect={true}
            onChangeText={setEmail}
            textContentType="emailAddress"
            value={email}
            style={styles.textInput}
            placeholder="Email"
            onFocus={() => setTitle(false)}
          />
          <TouchableOpacity
            title="goToEmail"
            style={styles.goToEmail}
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          >
            <Text style={styles.labelEmail}>Go to login</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.scan}
          title="SendEmail"
          onPress={sendEmail}
        >
          <Text style={styles.button}>Send Password</Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFF5",
    marginHorizontal: 18,
  },
  button: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginHorizontal: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
  },
  labelEmail: {
    fontSize: 12,
    color: "#rgb(0, 103, 187)",
    textAlign: "right",
  },
  goToEmail: {
    width: "100%",
    marginVertical: 10,
  },
  scan: {
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    borderRadius: 10,
    backgroundColor: "#rgb(0, 103, 187)",
  },
  logo: {
    width: 90,
    height: 90,
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  header: {
    flex: 0.15,
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  root: {
    flex: 1,
    flexDirection: "column",
  },
  rowContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  text: {
    flex: 1,
  },
  textInput: {
    width: "100%",
    marginTop: 10,
    paddingLeft: 6,
    borderRadius: 10,
    backgroundColor: "white",
    height: Platform.OS === "ios" ? 40 : undefined,
  },
});
