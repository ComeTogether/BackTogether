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
import { AuthContext } from "../../App";
import Snackbar from 'react-native-snackbar';


export default function Login({ navigation }) {
  const { signIn } = React.useContext(AuthContext);

  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [wait, setWait] = React.useState(false)

  const snack = (msg) => {
    Snackbar.show({
      text: `${msg}`,
      textColor:'red',
      backgroundColor: 'white',
      duration: Snackbar.LENGTH_SHORT,
      action: {
        text: 'UNDO',
        textColor: 'rgb(0, 103, 187)',
        onPress: () => { Snackbar.dismiss()},
      },
    });
  }

  function validation() {
    const email_trimmed = email.toLowerCase().trim();

    if (email_trimmed == "") {
      snack("Email cannot be empty")
      return true;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,8}$/i.test(email_trimmed)
    ) {
      snack("Email format is not valid")
      return true;
    } else if (password == "") {
      snack("Password cannot be empty");
      return true;
    } else {
      return false;
    }
  }

  const pressFunc = () => {
    const validate = validation();
    if (validate) return;
    signIn(email, password, setWait)
  }

  if (wait) {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor:'efeff5' }}>
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
        <Text style={styles.header}> Login</Text>
          <View style={styles.rowContainer}>
            <TextInput
              autoCorrect={true}
              onChangeText={setEmail}
              value={email}
              style={styles.textInput}
              secureTextEntry={false}
              placeholder="Email"
            />
            <TextInput
              autoCorrect={false}
              onChangeText={setPassword}
              value={password}
              style={styles.textInput}
              secureTextEntry={true}
              placeholder="Password"
            />
            <TouchableOpacity
              title="resetPass"
              style={styles.goToEmail}
              onPress={() => {
                navigation.navigate("Login_reset_password");
              }}
            >
              <Text style={styles.labelEmail}>Reset your password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              title="goToEmail"
              style={styles.goToEmail}
              onPress={() => {
                navigation.navigate("SendEmail");
              }}
            >
              <Text style={styles.labelEmail}>
                Don't have an account? Register now!
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.scan}
            title="Login"
            onPress={() => { pressFunc()}}
          >
            <Text style={styles.button}>Login</Text>
          </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFF5",
    marginHorizontal:18,
  },
  button: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
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
  },
  scan: {
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    borderRadius: 10,
    backgroundColor: "#rgb(0, 103, 187)",
    marginTop: 5
  },
  logo: {
    width:90,
    height:90,
    alignSelf:'center',
    marginBottom: 20,
    marginTop: 20,
  },
  header: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    overflow:'hidden'
  },
  text: {
    flex: 1,
  },
  textInput: {
    paddingLeft: 6,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: "white",
    height: Platform.OS === 'ios' ? 40 : undefined
  },
});
