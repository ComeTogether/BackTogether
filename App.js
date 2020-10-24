/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { enableScreens } from "react-native-screens";
import { Login, SettingsBtn, QrVerification } from "./src/components";
import {
  TabNavigator,
  SettingsNavigator,
  LoginNavigator,
} from "./src/navigators";
import { LogoTitle, Splash } from "./src/components";
import { connect } from "react-redux";
import { insertToken, deleteToken, restoreToken } from "./actions";
import { useRoute } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import Snackbar from 'react-native-snackbar';
import PersonalInfos from "./src/components/PersonalInfos";
import {SafeAreaView} from "react-native";
import * as firebase from "firebase";
import {FIREBASE_WEB_API_KEY, FIREBASE_PROJECT_ID} from "@env"

//secondary app for creating users (during test insertion and assign of role)
export const secondaryApp = firebase.initializeApp(
  {
    apiKey: FIREBASE_WEB_API_KEY,
    projectId: FIREBASE_PROJECT_ID,
  },
  "secondary"
);

// performance imporovement for navigator
enableScreens();

//Navigator initialization
const Stack = createStackNavigator();
export const AuthContext = React.createContext();

const App = ({ userToken, isLoading, isSignout, dispatch }) => {
  const [firebaseLogin, setfirebaseLogin] = React.useState(false);
  const snack = (msg) => {
    Snackbar.show({
      text: `${msg}`,
      textColor:'red',
      backgroundColor: 'white',
      duration: Snackbar.LENGTH_SHORT,
      action: {
        text: 'UNDO',
        textColor: 'rgb(0, 103, 187)',
        onPress: () => { Snackbar.dismiss()},
        },
    });
  }
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      // After restoring token, we may need to validate it in production apps
      // request to backend in order to see if the token is valid / maybe with the mac address ??

      // This will switch to the A
      // screen will be unmounted and thrown away.
      dispatch(restoreToken());
    };
    if (userToken != null) {
      bootstrapAsync();
    } else {
      dispatch(restoreToken());
    }
  }, []);


  const RouteName = () => {
    const route = useRoute();
    return (
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 24,
          marginLeft: 18,
          color: "black",
        }}
      >
        {route.name}
      </Text>
    );
  };
  const authContext = React.useMemo(
    () => ({
      signIn: async (email, password, setWait) => {
        setWait(true);
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        try {
          const email_trimmed = email.toLowerCase().trim();
          auth()
            .signInWithEmailAndPassword(email_trimmed, password)
            .then(async (data) => {
              const userid = data.user.uid;
              firestore()
                .collection("users")
                .doc(userid)
                .get()
                .then((doc) => {
                  if (!doc.empty) {
                    const data = doc.data();
                    setWait(false);
                    dispatch(insertToken(data));
                  } else {
                    setWait(false);
                  }
                });
            })
            .catch((error) => {
              setWait(false);
              if (error.code === "auth/invalid-email") {
                snack("That email address is invalid");
              } else if (error.code === "auth/wrong-password") {
                snack("Password is not correct");
              } else if (error.code === "auth/user-not-found") {
                snack("User not found");
              } else {
                snack("Something went wrong");
              }
            });
        } catch (error) {
          alert(error);
          setWait(false);
        }
      },

      signOut: async () => {
        dispatch(deleteToken());
      },
    }),
    []
  );
  auth().onAuthStateChanged(() => {
    if (auth().currentUser !== null) {
      setfirebaseLogin(true);
    } else {
      setfirebaseLogin(false);
      dispatch(deleteToken());
    }
  });

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#efeff5'}}>

    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <SafeAreaView style={{flex:1}}>
        <Stack.Navigator
          headerMode={
            userToken == null || !firebaseLogin || isLoading ? "none" : "screen"
          }
        >
          {userToken == null || !firebaseLogin ? (
            <Stack.Screen
              name="SignIn"
              component={LoginNavigator}
              options={{
                title: "Sign in",
                animationTypeForReplace: isSignout ? "pop" : "push",
              }}
            />
          ) :( userToken.stepSeen? (
            <>
              {isLoading && <Stack.Screen name="Splash" component={Splash} />}
              <Stack.Screen
                name="TabNavigator"
                component={TabNavigator}
                options={{
                  headerStyle: {
                    backgroundColor: "#efeff5",
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                  },
                  headerRight: (props) => <SettingsBtn />,
                  // headerLeft: (props) => (<RouteName />),
                  headerTitle: (props) => (
                    <>
                      <LogoTitle {...props} />
                    </>
                  ),
                  headerTitleAlign: "center",
                  headerStatusBarHeight: 10,
                }}
              />
              <Stack.Screen
                name="Settings"
                component={SettingsNavigator}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="VerifyByQR"
                component={QrVerification}
                options={{
                  title: "Scan QR Code",
                }}
              />
            </>
          ) : (<>
               {isLoading && <Stack.Screen name="Splash" component={Splash} />}
                <Stack.Screen
                  name="PersonalInfos"
                  component={PersonalInfos}
                  options={{
                    headerShown: false,
                    title: "Personal Infos",
                  }}
                />
                </>
              )
          )}

        </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </AuthContext.Provider>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  userToken: state.auth.userToken,
  isSignout: state.auth.isSignout,
  isLoading: state.auth.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
