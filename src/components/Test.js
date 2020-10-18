import React from 'react';
import { View, Text, Image,TouchableOpacity } from 'react-native';
import {B} from '../components';

const Test = ({id, title, date, expiration, result, onSelect, role, status}) => {

    return(
        <View style={{marginHorizontal:18, marginVertical:5, backgroundColor:'white', paddingHorizontal:18, paddingVertical:5, borderRadius:10}}>
        <TouchableOpacity onPress={()=>onSelect(id)} style={{flex:1, flexDirection:'row', justifyContent:'space-between',  alignItems:'center'}}>
            <View>
                <Text style={{fontSize:18, fontWeight:'bold', color:'blue'}}>
                    {title}
                </Text>
                <Text>
                    <B>Date:</B> {date}
                </Text>
                <Text>
                    <B>Expiration Date:</B> {expiration}
                </Text>
            </View>
            <View>
              {role === 'admin' ?
                <Image style={{width: 18, height: 18}}
                       source={status === 'accepted' ? require('../../images/green-tick.png') : (status === 'pending' ? require('../../images/ellipsis.png') : require('../../images/red-x.png'))}/>
                :
                <Image style={{width: 18, height: 18}}
                       source={result ? require('../../images/green-tick.png') : require('../../images/red-x.png')}/>
              }
                </View>
        </TouchableOpacity>
        </View>
    )
}

export default Test;
