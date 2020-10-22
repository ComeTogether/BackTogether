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

export default function SettingsUserProfile() {
  const [fullname, setFullname] = React.useState("");
  const navigation = useNavigation();

  const backfunc = () => {
    navigation.goBack();
  };

  const snack = (msg) => {
    Snackbar.show({
      text: `${msg}`,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: "white",
      textColor: "red",
      action: {
        text: "UNDO",
        textColor: "rgb(0, 103, 187)",
        onPress: () => {
          Snackbar.dismiss();
        },
      },
    });
  };

  useEffect(() => {
     effect

     
  }, [input])

  const updateProfile = async () => {
    console.warn(fullname);
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
          onChangeText={setFullname}
          textContentType="text"
          value={fullname}
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
