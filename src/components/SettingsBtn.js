import React from 'react';
import {Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const SettingsBtn = () => {

    const navigation = useNavigation();

    const settings = () => {
        navigation.navigate('Settings');
    }

    return(
        <TouchableOpacity style={{marginHorizontal:18}} onPress={()=> {settings()}}>
            <Image source={require("../../images/settings.png")} style={{width:24, height:24}}/>
        </TouchableOpacity>
    )
}

export default SettingsBtn;
