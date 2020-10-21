import React from 'react';
import {Image} from 'react-native';

export default function LogoTitle() {
    return (
      <Image
        style ={{flex:1}}
        source={require('../../images/logo.png')}
        style={{width:48, height:48}}
      />
    );
  }
