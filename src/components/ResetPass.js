import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View, Image} from 'react-native';
import { NumericPad, PasscodeView } from '../components';
import { useNavigation } from '@react-navigation/native';
import { connect } from "react-redux";
import { resetNewCode, resetPassCode, setStatus, resetConfCode, setRepeat } from '../../actions';

const ChangePassword = ({status, repeat, dispatch}) => {
    const navigation = useNavigation();
    
    const backfunc = () => {
        dispatch(resetPassCode());
        dispatch(resetNewCode());
        dispatch(resetConfCode());
        dispatch(setRepeat(false));
        dispatch(setStatus(true));
        navigation.goBack();
    }

    return (
    <View style={{marginVertical:20, marginHorizontal:18, flexDirection:'column', flexGrow:1}}>
        <View style={{flexGrow:0.5}}>
        <TouchableOpacity onPress={backfunc}>
            <Image style={{width:24, height:24}} source={require('../../images/back.png')} />
        </TouchableOpacity>
        </View>
    <View style={{flexGrow:2, flexDirection:'column', justifyContent:'space-between', marginHorizontal:18}}>
        <Text style={styles.texts}>{status? "Enter your existing passcode": repeat? "Confirm your new passcode":"Create your new passcode"}</Text>
        <PasscodeView/>
        <NumericPad/>
    </View>
    </View>

    );
  }
 
 const styles = StyleSheet.create({
    texts: {
        textAlign:'center',
        fontWeight:'bold',
        fontSize: 18,
      },
 })

const mapStateToProps = (state) => ({
    status: state.pass.old,
    repeat: state.pass.repeat
});

const mapDispatchToProps = (dispatch) => ({
    dispatch,
  });
  

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);