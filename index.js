import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Splash} from './src/components'
import { applyMiddleware, createStore, compose } from 'redux';
import logger from 'redux-logger';
import rootReducers from './reducers';
import { persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import React from 'react'
import messaging from '@react-native-firebase/messaging';
import {connect} from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'


const fb =({userToken}) => messaging().setBackgroundMessageHandler(async (message) => {
  console.log(message)
  console.log(userToken.email)
    if(message && message.to == userToken.email ) {
      console.log('Notification caused app to open from quit state:', message.notification)
    }
  })

const mapStateToProps = (state) => ({
  userToken: state.auth.userToken,
});

connect(mapStateToProps)(fb)

//redux initialization
const store = createStore(
    rootReducers,
    composeWithDevTools(applyMiddleware(
        logger,
        thunk
    ))
  );
  
const persistor = persistStore(store);

const Main = (props) => (
    <Provider store={store}>
        <PersistGate loading={<Splash />} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
)

AppRegistry.registerComponent(appName, () => Main);
