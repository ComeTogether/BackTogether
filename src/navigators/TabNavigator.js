import React from 'react';
import {Image} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {InsertUser, VerifyOptions} from '../components';





const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Insert') {
            iconName = focused? require('../../images/insert_user_active.png'):require('../../images/inser_user_inactive.png');
          }
          if (route.name === 'Verify') {
            iconName = focused? require('../../images/verify_user_active.png'):require('../../images/verify_user_inactive.png');
          }

          // You can return any component that you like here!
          return <Image source={iconName} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#FF652F',
        inactiveTintColor: '#B4CFF2',
        labelPosition:'below-icon',
        style: {
          height:70,
          backgroundColor: 'black'
        },
        tabStyle: {
          alignItems:'center',
          justifyContent: 'center',
        },
        labelStyle: {
        fontSize:15
        }
      }}
      backBehavior= 'history'
      initialRouteName= 'Insert'
    >
      <Tab.Screen name="Insert" component={InsertUser} />
      <Tab.Screen name="Verify" component={VerifyOptions} />
    </Tab.Navigator>
    );
  }
