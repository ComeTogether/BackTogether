import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Contact() {
  const navigation = useNavigation();

  const backfunc = () => {
    navigation.goBack();
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
          Contact Information
        </Text>
      </View>

      <View style={{ flexGrow: 2, flexDirection: "column", padding: 8}}>
        <View  style={{  display: 'flex', flexDirection: "row",  marginTop: 100,  marginBottom: 40 }}>

        <Text style={{ fontWeight: "bold", fontSize: 18, color: "black" }}>
          Email: &nbsp;
        </Text>
        <Text style={{   fontSize: 18,  flex: 1, flexWrap: 'wrap' }}>
          support@cometogether.network
        </Text>
        </View>
        <View  style={{  display: 'flex', flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, color: "black" }}>
            Phone: &nbsp;
          </Text>
          <Text style={{   fontSize: 18 }}>
              +306948896353
          </Text>
        </View>

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
