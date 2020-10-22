import React from 'react';
import {TouchableOpacity, Text, TextInput, View, StyleSheet, ScrollView, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Policy from "./Policy";
import Terms from "./Terms";
import {deleteUser} from '../services/sevices';
import Snackbar from 'react-native-snackbar';



export function PrivacyPolicy() {
    return (
       <ScrollView contentContainerStyle={styles.container}>
         <Policy/>
       </ScrollView>
    );
 }
 export function TermsOfUse() {
    return (
       <View style={styles.container}>
         <Terms/>
       </View>
    );
 }


 export function DeleteAccount() {
    const [password, setPassword] = React.useState('')
    const navigation = useNavigation();

    const backfunc = () => {
      navigation.goBack();
    }

    const snack = (msg, color) => {
      Snackbar.show({
         text: `${msg}`,
         duration: Snackbar.LENGTH_SHORT,
         backgroundColor:'white',
         textColor:`${color}`,
         action: {
           text: 'UNDO',
           textColor: 'rgb(0, 103, 187)',
           onPress: () => { Snackbar.dismiss()},
         },
      });
    }
  
    const deleteAccount = async () => {
       if(password == "") snack('Password can not be empty', 'red')
      const msg = await deleteUser(password);
      if( msg ){
         navigation.goBack();
         snack('Account Deleted', `green`);
      }
      else {
         snack('Wrong Password', 'red');
      }
    }
    return (
       <View style={styles.container}>
         <View style={{flexDirection:'row', marginTop:20, marginHorizontal:18, flexGrow:0.5}}>
          <TouchableOpacity style={{marginRight:18}} onPress={backfunc}>
              <Image style={{width:24, height:24}} source={require('../../images/back.png')} />
          </TouchableOpacity>
          <Text style={{fontWeight:'bold', fontSize:18, color:'dimgrey'}}>Delete Account</Text>
        </View>
        <View style={{flexGrow:2, flexDirection:'column'}}>
          <Text style={styles.texts}>Confirm with your passcode</Text>
          <TextInput
            autoCorrect={false}
            onChangeText={setPassword}
            textContentType='password'
            value={password}
            style={styles.textInput}
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.confirmButton} title="Delete Account" onPress= {()=>{deleteAccount()}} >
             <Text style={styles.optionButtonText}>Delete Account</Text>
          </TouchableOpacity>
         </View>
       </View>
    );
 }

 const styles = StyleSheet.create({
    container: {
      flex:1
    },
    confirmButton: {
       marginHorizontal: 18,
       marginVertical:20,
       justifyContent:'center',
       alignItems: 'center',
       height:40,
       borderRadius:10,
       backgroundColor: 'rgb(0, 103, 187)',
    },
    optionButtonText: {
       fontSize: 18,
       color:'#FFFFFF',
       fontWeight: 'bold',
    },
    texts: {
       textAlign:'center',
       fontWeight:'bold',
       fontSize: 18,
     },
    textInput: {
      height:40,
      margin: 18,
      paddingLeft: 6,
      borderRadius: 10,
      backgroundColor: 'white'
     },
 })
