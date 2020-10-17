import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {CertificateHistory, CertificateSummary} from '../components'
import CertificateStatus from "../components/CertificateStatus";

const Certificate = createStackNavigator();

const CertificateNavigator = (props) => {

  const { role } = props
    const config = {
        animation: 'spring',
        config: {
          stiffness: 50000,
          damping: 100,
          mass: 3,
          overshootClamping: true,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01,
        },
      };
    return(
        <Certificate.Navigator
            headerMode='none'
            mode='modal'
            screenOptions={{
                // cardStyle: { backgroundColor: 'transparent'},
                cardOverlayEnabled: true,
            }}
        >
          {
            role === "admin" ?
              <Certificate.Screen name='CertificateStatus' component={CertificateStatus}
                                  options={{header : ({ scene, previous, navigation }) => ( null)}}/>
                                  :
              <Certificate.Screen name='History' component={CertificateHistory}
                                  options={{header : ({ scene, previous, navigation }) => ( null)}}/>
          }

            <Certificate.Screen name='Summary' component= {CertificateSummary}
             options={{
                transitionSpec: {
                  open: config,
                  close: config,
                }}}/>
        </Certificate.Navigator>
    )
}

export default CertificateNavigator;
