import React from 'react';
import {View, ScrollView, Image, Text, TouchableOpacity} from 'react-native';
import { Settings} from '../components';
import SettingsBtn from './SettingsBtn';


const SettingsScreen = ({navigation}) => {


    const backfunc = () => {
        navigation.goBack();
    }

    return(
      <ScrollView style={{backgroundColor:'#efeff5'}} contentContainerStyle={{flexGrow:1}}>
            <View style={{flexDirection:'row', marginVertical:20, marginHorizontal:18}}>
                <TouchableOpacity style={{marginRight:18}} onPress={backfunc}>
                    <Image style={{width:24, height:24}} source={require('../../images/back.png')} />
                </TouchableOpacity>
                <Text style={{fontWeight:'bold', fontSize:18, color:'dimgrey'}}>Settings</Text>
            </View>
            <View style={{backgroundColor:'white', borderRadius:10, marginHorizontal:18, marginBotton:20, paddingVertical:20}}>
                <Settings icon={require("../../images/password.png")} name="Change Password" to='Change' />
                <Settings icon={require("../../images/privacy_policy.png")} name="Privacy Policy" to='Privacy' />
                <Settings icon={require("../../images/terms.png")} name="Terms & Conditions" to='Terms' />
                <Settings icon={require("../../images/delete.png")} name="Delete Account"  to='Delete' />
                <Settings icon={require("../../images/delete.png")} name="Profile"  to='Profile' />
                <Settings icon={require("../../images/logoutRed.png")} name="Logout"  to='Logout' />
            </View>
                <Image style={{position:'absolute', bottom:40, width:90, height:90, alignSelf:'center'}} source={require('../../images/logo_name.png')} resizeMode='contain' />
          </ScrollView>
    )
}

export default SettingsScreen;
