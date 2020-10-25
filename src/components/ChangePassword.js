import React from 'react';
import {View, TouchableOpacity, Image, Text, TextInput, StyleSheet, BackHandler} from 'react-native';
import {resetPassUser} from '../services/sevices';
import { useNavigation } from '@react-navigation/native';
import {connect} from 'react-redux';
import { setNewCode,setPassCode,setConfCode, resetPassCode, resetNewCode, resetConfCode, setRepeat, setStatus } from '../../actions';
import Snackbar from 'react-native-snackbar';



const ChangePassword = ({currentpass, newpass, confpass, status, repeat, dispatch}) => {
    const navigation = useNavigation();

    const backfunc = () => {
      dispatch(resetPassCode());
      dispatch(resetNewCode());
      dispatch(resetConfCode());
      dispatch(setRepeat(false));
      dispatch(setStatus(true));
      navigation.goBack();
    }
    
    const replicabackbutton = () => {
      dispatch(resetPassCode());
      dispatch(resetNewCode());
      dispatch(resetConfCode());
      dispatch(setRepeat(false));
      dispatch(setStatus(true));
    }
    
    React.useEffect(()=>{
      const backHandler = BackHandler.addEventListener(
         "hardwareBackPress",
         replicabackbutton
       );
       return () => backHandler.remove();
    },[])

    const snack = (msg, color) => {
      Snackbar.show({
         text: `${msg}`,
         duration: Snackbar.LENGTH_SHORT,
         backgroundColor:'white',
         textColor: `${color}`,
         action: {
         text: 'UNDO',
         textColor: 'rgb(0, 103, 187)',
         onPress: () => { Snackbar.dismiss()},
         },
      });
    }

    const reset = async () => {
      if( currentpass == "" || newpass == ""){ 
         replicabackbutton();
         snack('Password can not be empty', 'red');
         return ;
      }
      if( confpass == newpass ){
         const msg = await resetPassUser(currentpass, newpass);
         if( msg ){
            backfunc()
            snack('Password updated', 'green')
         }
         else {
            dispatch(resetPassCode());
            dispatch(resetNewCode());
            dispatch(resetConfCode());
            dispatch(setRepeat(false));
            dispatch(setStatus(true));
            snack(`Wrong Password`, 'red');
         }
      }
      else {
         dispatch(resetNewCode());
         dispatch(resetConfCode());
         dispatch(setRepeat(false));
         snack(`Wrong Confirmation Password`, 'red');
      }
    }

    const next1 = () => {
       dispatch(setStatus(false));
    }
    const next2 = () => {
      dispatch(setRepeat(true));
   }


    const setPass = (text) =>{
       status?dispatch(setPassCode(text)):repeat?dispatch(setConfCode(text)):dispatch(setNewCode(text));
    }

    return (
       <View style={styles.container}>
         <View style={{flexDirection:'row', marginTop:20, marginHorizontal:18, flexGrow:0.5}}>
          <TouchableOpacity style={{marginRight:18}} onPress={backfunc}>
              <Image style={{width:24, height:24}} source={require('../../images/back.png')} />
          </TouchableOpacity>
          <Text style={{fontWeight:'bold', fontSize:18, color:'dimgrey'}}>Change Password</Text>
        </View>
        <View style={{flexGrow:2, flexDirection:'column'}}>
        <Text style={styles.texts}>{status? "Enter your existing passcode": repeat? "Confirm your new passcode":"Create your new passcode"}</Text>
          <TextInput
            autoCorrect={false}
            onChangeText={text => setPass(text)}
            textContentType='password'
            value={status?currentpass:repeat?confpass:newpass}
            style={styles.textInput}
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.confirmButton} title="Change Password" onPress= {()=>{status?next1():repeat?reset():next2()}} >
             <Text style={styles.optionButtonText}>{status?'Next':repeat?'Change Password':'Next'}</Text>
          </TouchableOpacity>
         </View>
       </View>
    );
 }


const mapStateToProps = (state) => ({
currentpass: state.pass.passCode,
newpass: state.pass.newCode,
confpass: state.pass.confCode,
status: state.pass.old,
repeat: state.pass.repeat
});

const mapDispatchToProps = (dispatch) => ({
dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);


 const styles = StyleSheet.create({
    container: {
      flex:1
    },
    optionButton: {
       margin: 25,
       justifyContent:'center',
       alignItems: 'center',
       alignSelf: 'center',
       height:44,
       borderRadius:7,
       backgroundColor: '#rgb(0, 103, 187)',
       width:'70%',
       overflow:"hidden"
    },
    confirmButton: {
       marginHorizontal: 18,
       marginVertical:20,
       justifyContent:'center',
       alignItems: 'center',
       height:40,
       borderRadius:10,
       backgroundColor: '#rgb(0, 103, 187)',
    },

    optionButtonText: {
       fontSize: 18,
       color:'#FFFFFF',
       fontWeight: 'bold',
    },
    texts: {
       textAlign:'center',
       fontWeight:'bold',
       fontSize: 18,
     },
    textInput: {
      height:40,
      margin: 18,
      paddingLeft: 6,
      borderRadius: 10,
      backgroundColor: 'white'
     },
 })
