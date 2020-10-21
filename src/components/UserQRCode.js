import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import QRCode from "react-native-qrcode-svg";
import { Picker } from "@react-native-community/picker";
import { sha256 } from "react-native-sha256";
import firestore from "@react-native-firebase/firestore";

const UserQRCode = ({ navigation, userToken }) => {
  const [value, HashValue] = React.useState("");
  const [testType, changeTestType] = React.useState(null);
  const [userTestTypes, setUserTestTypes] = React.useState([]);
  const [userTestData, setUserTestData] = React.useState([]);

  let un = () => {};

  React.useEffect(() => {
    const query = firestore()
      .collection("tests")
      .where("userId", "==", userToken.id);

    un = query.onSnapshot((querySnapshot) => {
      const data = [];

      querySnapshot.forEach((documentSnapshot) => {
        data.push({
          ...documentSnapshot.data(),
        });
      });

      //remove duplicate tests (of the same type) by date
      const removedDuplicates = [];
      data.forEach(function(item) {
        const index = removedDuplicates.findIndex(
          (duplicate) => duplicate.testType === item.testType
        );
        if (index === -1) {
          removedDuplicates.push(item);
        } else {
          const duplicateDate = Date.parse(removedDuplicates[index].issueDate);
          const itemDate = Date.parse(item.issueDate);
          if (itemDate > duplicateDate) {
            removedDuplicates.splice(index, 1, item);
          }
        }
      });

      setUserTestTypes(
        removedDuplicates.map((item) => {
          return { value: item.testType, label: item.testType };
        })
      );
      setUserTestData(removedDuplicates);
    });

    return () => un();
  }, []);

  React.useEffect(() => {
    if (testType && userTestData.length > 0) {
      const index = userTestData.findIndex(
        (test) => test.testType === testType
      );
      index !== -1 && HashValue(JSON.stringify(userTestData[index]));
    }
  }, [testType, userTestData]);

  return (
    <View style={{ flexGrow: 1, backgroundColor: "#efeff5" }}>
      <Text style={{ fontSize: 22, textAlign: "center", marginTop: 15 }}>
        QR Code
      </Text>
      <View style={styles.typeDropdown}>
        <Picker
          selectedValue={testType}
          style={{ height: 40 }}
          itemStyle={{ fontSize: 16 }}
          onValueChange={(itemValue) => {
            if (itemValue !== 0) {
              changeTestType(itemValue);
            }
          }}
        >
          <Picker.Item
            style={{ color: "dimgrey" }}
            key={0}
            label="Please select..."
            value={"Select"}
          />

          {userTestTypes.map((type) => {
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
      <View
        style={{
          flex: 1,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 60,
        }}
      >
        {value !== "" ? (
          <QRCode
            value={value}
            color="rgb(0,103,187)"
            size={200}
            backgroundColor="#efeff5"
          />
        ) : (
          <Text style={{ fontSize: 22 }}>Please select a test type</Text>
        )}
      </View>
    </View>
  );
};

const mapStateToProps = (state, props) => ({
  navigation: props.navigation,
  userToken: state.auth.userToken,
});

export default connect(mapStateToProps)(UserQRCode);

const styles = StyleSheet.create({
  typeDropdown: {
    marginHorizontal: 18,
    marginVertical: 20,
    marginBottom: 2,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
