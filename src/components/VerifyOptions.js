import {
  ScrollView,
  StyleSheet, Text, TouchableOpacity,
  View
} from 'react-native';
import React, { Component } from 'react'

class VerifyOptions extends Component {
  constructor(props) {

    super(props);

    this.state = {
      verifyType: ''
    };
  }

  openIdVerification() {
    this.props.navigation.navigate('VerifyById');
  }


  openQRVerification() {
    this.props.navigation.navigate('VerifyByQR');
  }

  render() {
    return (
      <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Verify options</Text>
          <TouchableOpacity
            style = {styles.idVerificationButton}
            onPress = {
              () => this.openIdVerification()
            }>
            <Text style = {styles.idVerificationButtonText}> Id verification </Text>
          </TouchableOpacity>
        <TouchableOpacity
          style = {styles.qrCodeVerificationButton}
          onPress = {
            () => this.openQRVerification()
          }>
          <Text style = {styles.qrCodeVerificationButtonText}> QR code verification </Text>
        </TouchableOpacity>
      </ScrollView>
      </View>
    );
  }
}
export default VerifyOptions


const styles = StyleSheet.create({
  container: {
    margin:15,
    marginTop: 5
  },
  preview: {
    height:200,
    flex: 1,
    alignItems: 'center',
    width: '100%',
    overflow: "hidden",
    justifyContent: 'flex-end'
  },
  title: {
    fontSize: 28,
    margin: 'auto',
    color:'blue',
    textAlign: 'center',
    marginBottom:100
  },
  idVerificationButton: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 15,
    height: 40,
    borderRadius: 5,
    display: 'flex',
    alignSelf:'center',
    width: 200,
    color: 'white',
    marginBottom:80
  },
  idVerificationButtonText: {
    color: 'white',
    margin:'auto',
    textAlign:'center',
    alignItems: 'center'
  },
  qrCodeVerificationButton: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 15,
    height: 40,
    borderRadius: 5,
    display: 'flex',
    alignSelf:'center',
    width: 200,
    color: 'white',
  },
  qrCodeVerificationButtonText: {
    color: 'white',
    margin:'auto',
    textAlign:'center',
    alignItems: 'center'
  },
  idIcon: {
    alignItems: 'center'
  }
});
