import React from 'react';
import {View, ScrollView, Image, Text, TouchableOpacity} from 'react-native';
import { useTranslation } from 'react-i18next';


const ChangeLanguage = ({navigation}) => {
    const { t,i18n } = useTranslation();
    const backfunc = () => {
        navigation.goBack(); 
    }
    const list = [
        {title: '🇬🇧  English', language: 'en' },
        {title: '🇬🇷  Ελληνικά', language: 'el' },
    ]
    return(
      <ScrollView style={{backgroundColor:'#efeff5'}} contentContainerStyle={{flexGrow:1}}>
            <View style={{flexDirection:'row', marginVertical:20, marginHorizontal:18}}>
                <TouchableOpacity style={{marginRight:18}} onPress={backfunc}>
                    <Image style={{width:24, height:24}} source={require('../../images/back.png')} />
                </TouchableOpacity>
                <Text style={{fontWeight:'bold', fontSize:18, color:'dimgrey'}}>{t('settings:language')}</Text>
            </View>
            <View style={{backgroundColor:'white', borderRadius:10, marginHorizontal:18, marginBotton:20, paddingVertical:20}}>
                { list.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => i18n.changeLanguage(item.language)} style={{flexDirection:'row', flex:1, marginHorizontal:18, marginVertical:10}} >
                        <Text style={{fontSize:18, fontWeight: i18n.language === item.language ? 'bold' : 'normal'}} >{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Image style={{position:'absolute', bottom:40, width:90, height:90, alignSelf:'center'}} source={require('../../images/logo_name.png')} resizeMode='contain' />
    </ScrollView>
    )
}

export default ChangeLanguage;
