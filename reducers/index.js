import { combineReducers } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import {persistReducer } from 'redux-persist';

import authReducer from './auth';
import privateKeyReducer from './privateKey';
import stepsReducer from './steps';
import passCodeReducer from './pass';
import filtersReducer from './filters'

const privateKeyPersistConfig = {
    key: 'privateKey',
    storage: AsyncStorage,
    whitelist: ['privateKey']
}

const authPersistConfig = {
    key: 'userToken',
    storage: AsyncStorage,
    whitelist: ['userToken']
}

const stepsPersistConfig = {
    key: 'stepsSeen',
    storage: AsyncStorage,
    whitelist: ['stepsSeen']
}

const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['privateKey','auth','steps']
}

const filtersPersistConfig = {
  key: 'certificateStatusFilterLabel',
  storage: AsyncStorage,
  whitelist: ['certificateStatusFilterLabel']
}


const reducer =  combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    privateKey: persistReducer(privateKeyPersistConfig, privateKeyReducer),
    steps: persistReducer(stepsPersistConfig, stepsReducer),
   filters: persistReducer(filtersPersistConfig, filtersReducer),
  pass: passCodeReducer
})

export default persistReducer(rootPersistConfig, reducer)
