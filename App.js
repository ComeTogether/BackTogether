/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import {Login, Logout, QrVerification} from './src/components';
import {TabNavigator} from './src/navigators';
import {LogoTitle, Splash} from './src/components';
import {connect} from 'react-redux';
import { insertToken, deleteToken, restoreToken } from './actions';
import IdVerification from "./src/components/IdVerification";


// performance imporovement for navigator
enableScreens();

//Navigator initialization
const Stack = createStackNavigator();
export const AuthContext = React.createContext();


const App = ({userToken, isLoading, isSignout, dispatch}) => {

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      // After restoring token, we may need to validate it in production apps

      // This will switch to the A
      // screen will be unmounted and thrown away.
      dispatch(restoreToken());
    };
    if(userToken != null){
      bootstrapAsync();
    }else {
      dispatch(restoreToken())
    }
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async () => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        try {
          // let response = await fetch(domain.BACKEND_URL + `/hackathon/testingRoute`,
          // {
          //   method:'GET'
          // });
          // let responseJson = await response.json();

          dispatch(insertToken("User"));

        }
        catch(error){
          alert(error)
        }
      },

      signOut: async () =>{
        dispatch(deleteToken())
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
      <Stack.Navigator
        headerMode={userToken == null || isLoading ?'none':'screen'}>
        {userToken == null?
        (
          <Stack.Screen
            name="SignIn"
            component={Login}
            options={{
              title: 'Sign in',
              animationTypeForReplace: isSignout ? 'pop' : 'push',
            }}
          />
        ) : (
          <>
          {isLoading && <Stack.Screen name="Splash" component={Splash}/>}
          <Stack.Screen
            name="TabNavigator"
            component={TabNavigator}
            options={{
              headerStyle: {
                backgroundColor: 'black',
                height:45
              },
              headerRight: props=> (
                <Logout />
              ),
              headerTitle: props => (
              <>
                <LogoTitle {...props} />
              </>
              ),
              headerTitleAlign:'center'
            }}
          />
          </>
        )}
        <Stack.Screen
          name="VerifyById"
          component={IdVerification}
          options={{
            title: 'Scan or type Id'
          }}
        />
        <Stack.Screen
          name="VerifyByQR"
          component={QrVerification}
          options={{
            title: 'Scan QR Code'
          }}
        />
      </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  )
}


const mapStateToProps = (state) => ({
  userToken: state.auth.userToken,
  isSignout: state.auth.isSignout,
  isLoading: state.auth.isLoading

})

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(App)


