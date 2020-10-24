import React from 'react';
import {View, ScrollView, Image, Text, TouchableOpacity} from 'react-native';
import { Settings } from '../components';
import { useTranslation } from 'react-i18next';


const SettingsScreen = ({navigation}) => {
    const { t } = useTranslation();

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
                <Settings icon={require("../../images/password.png")} name={t('settings:password')} to='Change' />
                <Settings icon={require("../../images/language.png")} name={t('settings:language')} to='Language' />
                <Settings icon={require("../../images/privacy_policy.png")} name={t('settings:privacy')} to='Privacy' />
                <Settings icon={require("../../images/terms.png")} name={t('settings:terms')} to='Terms' />
                <Settings icon={require("../../images/delete.png")} name={t('settings:delete')}  to='Delete' />
                <Settings icon={require("../../images/logoutRed.png")} name={t('settings:logout')}  to='Logout' />
            </View>
                <Image style={{position:'absolute', bottom:40, width:90, height:90, alignSelf:'center'}} source={require('../../images/logo_name.png')} resizeMode='contain' />
          </ScrollView>
    )
}

export default SettingsScreen;
