import React from "react";
import {
  TouchableOpacity,
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Snackbar from "react-native-snackbar";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function SettingsUserProfile() {
  const [fullName, setFullName] = React.useState("");
  const [count, setCount] = React.useState("");
  const [email, setEmail] = React.useState("");
  const navigation = useNavigation();

  const backfunc = () => {
    navigation.goBack();
  };

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

  React.useEffect(() => {
    const user = auth().currentUser;
    const userid = user.uid;

    firestore()
      .collection("users")
      .doc(userid)
      .get()
      .then((doc) => {
        if (!doc.empty) {
          setFullName(doc.data().fullName);
          setEmail(doc.data().email)
        }
      });
  }, []);

  const updateProfile = async () => {
    const user = auth().currentUser;
    const userid = user.uid;

    if (count > 2) {
      snack("Too many updates!", "red");
    } else {
      firestore()
        .collection("users")
        .doc(userid)
        .update({
          fullName: fullName,
        })
        .then((data) => {
          setCount(count + 1);
          snack("User's information has been updated!", "green");
        })
        .catch((err) => {
          snack("User's information has not been updated!", "red");
        });
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          marginTop: 20,
          marginHorizontal: 18,
          flexGrow: 0.5,
        }}
      >
        <TouchableOpacity style={{ marginRight: 18 }} onPress={backfunc}>
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../../images/back.png")}
          />
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold", fontSize: 18, color: "dimgrey" }}>
          Update Information
        </Text>
      </View>
      <View style={{ flexGrow: 2, flexDirection: "column" }}>
        <Text style={styles.texts}>Full Name</Text>
        <TextInput
          autoCorrect={false}
          onChangeText={setFullName}
          textContentType="name"
          value={fullName}
          style={styles.textInput}
        />

        <Text style={styles.texts}>Email</Text>
        <TextInput
          autoCorrect={false}
          onChangeText={setEmail}
          editable={false}
          value={email}
          style={styles.textInput}
        />
        <TouchableOpacity
          style={styles.confirmButton}
          title="Update Information"
          onPress={() => {
            updateProfile();
          }}
        >
          <Text style={styles.optionButtonText}>Update Information</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  confirmButton: {
    marginHorizontal: 18,
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgb(0, 103, 187)",
  },
  optionButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  texts: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  textInput: {
    height: 40,
    margin: 18,
    paddingLeft: 6,
    borderRadius: 10,
    backgroundColor: "white",
  },
});
