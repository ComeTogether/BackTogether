import React from 'react';
import {Image, Alert} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {connect} from 'react-redux';
import {getTabScreens} from './utils'
import messaging from '@react-native-firebase/messaging';
import firestore from "@react-native-firebase/firestore";
import Snackbar from 'react-native-snackbar';


const Tab = createBottomTabNavigator();



const  TabNavigator = ({userToken, navigation }) => {
  const [loading, setLoading] = React.useState(true)
  const [inRoute, setInRoute] = React.useState('');

  const snack = (msg) => {
    let title = `${msg.notification.title}`.toUpperCase();
    Snackbar.show({
      text: `${title}: ${msg.notification.body}`,
      textColor:'rgb(0,103,189)',
      backgroundColor: 'white',
      duration: Snackbar.LENGTH_INDEFINITE,
      action: {
        text: 'SHOW',
        textColor: 'black',
        onPress: () => { Snackbar.dismiss(); navigation.navigate(msg.data.type)},
        },
    });
  }

  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      console.log('I have the permission to act'); //getFcmToken();
    } else {
      requestPermission();
    }
  };

  const requestPermission = async () => {
    try {
      await messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
    }
  };

  async function saveTokenToDatabase(token) {
    // Assume user is already signed in
  
    // Add the token to the users datastore
    await firestore()
      .collection('users')
      .doc(userToken.id)
      .update({
        tokens: firestore.FieldValue.arrayUnion(token),
      });
  }

  React.useEffect(() => {
    checkPermission();
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      navigation.navigate(remoteMessage.data.type);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      snack(remoteMessage);
    });

    // Check whether an initial notification is available
    messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        setInRoute(remoteMessage.data.type);
      }
      setLoading(false);
    });

    // Get the device token
    messaging()
    .getToken()
    .then(token => {
      return saveTokenToDatabase(token);
    });

    // Listen to whether the token changes
    messaging().onTokenRefresh(token => {
      saveTokenToDatabase(token);
    });

    return unsubscribe;

  }, []);

  if (loading) {
    return null;
  }
  if(userToken == null) { 
    return null
  }
    return (
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Insert') {
            iconName = focused? require('../../images/insert.png'):require('../../images/insertG.png');
          }
          if (route.name === 'Verify') {
            iconName = focused? require('../../images/verify.png'):require('../../images/verifyG.png');
          }
          if (route.name === 'CertificateStatus') {
            iconName = focused? require('../../images/verify.png'):require('../../images/verifyG.png');
          }
          if (route.name === 'QR Code') {
            iconName = focused? require('../../images/qr.png'):require('../../images/qrG.png');
          }
          if (route.name === 'Certificates') {
            iconName = focused? require('../../images/history.png'):require('../../images/historyG.png');
          }
          if (route.name === 'Admin') {
            iconName = focused? require('../../images/B.png'):require('../../images/G.png');
          }

          const st = focused? null: {opacity:0.3}

          // You can return any component that you like here!
          return <Image source={iconName} style={[{width:24, height:24}, st]}/>;
        },
      })}
      tabBarOptions={{
        showLabel:false,
        style: {
          backgroundColor: 'white',
        },
        tabStyle: {
          alignItems:'center',
          justifyContent: 'center',
        },
      }}
      backBehavior= 'history'
      initialRouteName = {inRoute}
    > 
    {
      getTabScreens(userToken.role, Tab)
    }
    </Tab.Navigator>
    );
  }

  const mapStateToProps = (state, ownProps) => ({
    userToken: state.auth.userToken,
    navigation: ownProps.navigation
  
  })

  const mapDispatchToProps = (dispatch) => ({
    dispatch
  })

  export default connect(mapStateToProps, mapDispatchToProps)(TabNavigator)

