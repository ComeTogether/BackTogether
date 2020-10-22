import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PrivacyPolicy, TermsOfUse, DeleteAccount } from '../components/ViewsSettings';
import { SettingsScreen, Logout, ChangePassword } from '../components';

const Certificate = createStackNavigator();

const CertificateNavigator = () => {
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
            <Certificate.Screen name='Options' component={SettingsScreen}
             options={{header : ({ scene, previous, navigation }) => ( null)}}/>
            
            <Certificate.Screen name='Terms' component= {TermsOfUse} 
             options={{
                title:'Terms of Use',
                transitionSpec: {
                  open: config,
                  close: config,
                }}}
            />

            <Certificate.Screen name='Change' component= {ChangePassword} 
                options={{
                title:'Change Password',
                transitionSpec: {
                    open: config,
                    close: config,
                }}}
            />

            <Certificate.Screen name='Delete' component= {DeleteAccount} 
                options={{
                title:'Delete Account',
                transitionSpec: {
                    open: config,
                    close: config,
                }}}
            />

            <Certificate.Screen name='Privacy' component= {PrivacyPolicy} 
                options={{
                title:'Privacy Policy',
                transitionSpec: {
                    open: config,
                    close: config,
                }}}
            />

            <Certificate.Screen name='Logout' component= {Logout} 
                options={{
                title:'Logout',
                transitionSpec: {
                    open: config,
                    close: config,
                }}}
            />  

        </Certificate.Navigator>
    )   
}

export default CertificateNavigator;
