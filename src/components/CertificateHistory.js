import React from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { Test } from "../components";
import firestore from "@react-native-firebase/firestore";
import { connect } from "react-redux";

const db = firestore();

//db.settings({ host: 'localhost:8080',  ssl: false }); for local testing

const CertificateHistory = ({ navigation, userToken }) => {
  const [cert, setCert] = React.useState(null);
  const [wait, setWait] = React.useState(true);

  let un = () => {};

  React.useEffect(() => {
    const query = db
      .collection("tests")
      .where("userId", "==", userToken.id);

    un = query.onSnapshot((querySnapshot) => {
      const data = [];

      querySnapshot && querySnapshot.forEach((documentSnapshot) => {
        documentSnapshot.data().status === "accepted" &&
          data.push({
            ...documentSnapshot.data(),
          });
      });
      data.length > 0 ? setCert(data) : setCert(null);
    });

    setWait(false);
    return () => un();
  }, []);

  const onSelect = React.useCallback(
    (id, authorityName, issueDate, testType, result, status) => {
      navigation.navigate("Summary", {
        id: id,
        authorityName: authorityName,
        issueDate: issueDate,
        testType: testType,
        result: result,
        status: status
      });
    }
  );
  if (wait) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#efeff5",
        }}
      >
        <ActivityIndicator size="large" color="rgb(0, 103, 187)" />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#efeff5" }}>
        <Text style={{ fontSize: 22, textAlign: "center", marginTop: 15 }}>
          Certificate History
        </Text>
        {cert ? (
          <FlatList
            data={cert}
            ItemSeparatorComponent={() => <View style={{ marginTop: 5 }} />}
            ListHeaderComponent={() => <View style={{ paddingTop: 10 }} />}
            renderItem={({ item }) => (
              <Test
                id={item.testId}
                title={item.testType}
                date={item.issueDate}
                authorityName= {item.authorityName}
                expiration={item.expireDate}
                result={item.result}
                onSelect={() =>
                  onSelect(
                    item.testId,
                    item.authorityName,
                    item.issueDate,
                    item.testType,
                    item.result,
                    item.status
                  )
                }
              />
            )}
            keyExtractor={(item) => item.testId}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#efeff5",
            }}
          >
            <Image
              style={{ width: 48, height: 70, opacity: 0.9, marginVertical: 6 }}
              source={require("../../images/summary.png")}
            />
            <Text style={{ fontSize: 20, color: "rgb(0,103,189)" }}>
              No Certifications Available!
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
};

const mapStateToProps = (state) => ({
  userToken: state.auth.userToken,
});

export default connect(mapStateToProps)(CertificateHistory);
