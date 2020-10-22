import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Snackbar from 'react-native-snackbar';
import {connect} from 'react-redux';
import { insertToken } from "../../actions";
import firestore from "@react-native-firebase/firestore";


function PersonalInfos({userToken, dispatch }) {
  const [fullName, setFullName] = React.useState("");

  const snack = (msg) => {
    Snackbar.show({
      text: `${msg}`,
      backgroundColor:'white',
      textColor:'red',
      duration: Snackbar.LENGTH_SHORT,
      action: {
        text: 'UNDO',
        textColor: 'rgb(0, 103, 187)',
        onPress: () => { Snackbar.dismiss()},
      },
    });
  }

  const setPersonal = () => {
    if(fullName === ''){
        snack('Full Name can not be empty');
    }
    else {

        firestore()
        .collection("users")
        .where('email', '==', userToken.email)
        .get()
        .then((res) => {
          firestore()
          .collection("users")
          .doc(res.docs[0].ref.id)
          .update({
            fullName: fullName,
            stepSeen: true
          });
      })
      dispatch(insertToken({...userToken, stepSeen: true}))
    }
  }

    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../../images/BT_logoWithName.png")}
          resizeMode="contain"
        />
        <Text style={styles.header}> Personal Infos </Text>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Type your name</Text>

          <TextInput
            autoCorrect={true}
            onChangeText={setFullName}
            value={fullName}
            placeholder="Full Name"
            style={styles.textInput}
          />
        </View>
        <TouchableOpacity
          style={styles.scan}
          title="Set Personal Infos"
          onPress={setPersonal}
        >
          <Text style={styles.button}>Next</Text>
        </TouchableOpacity>
      </View>
    );
}

const mapStateToProps = (state) => ({
    userToken: state.auth.userToken,
    });

    const mapDispatchToProps = (dispatch) => ({
    dispatch,
    });

    export default connect(mapStateToProps, mapDispatchToProps)(PersonalInfos);

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
    paddingHorizontal: 20,
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
    marginTop: 20,
    marginBottom: 100,
  },
  logo: {
    width:90,
    height:90,
    alignSelf:'center',
    marginBottom: 20,
    marginTop: 20,
  },
  header: {
    flex: 0.3,
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
    height: 40
  },
});
