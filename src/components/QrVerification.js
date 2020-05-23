import React from 'react';
import { RNCamera } from 'react-native-camera';
import { Image, TouchableHighlight, Modal, StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {JsonRpc, RpcError } from 'eosjs';
import { sha256 } from 'react-native-sha256';
const rpc = new JsonRpc('https://jungle2.cryptolions.io:443', { fetch });


const QrVerification = ({offline, navigation, camera}) => {
  const [flash, setFlash] = React.useState(false)
  const [modalVisible, setModal] = React.useState(false)
  const [validating, setValidation] = React.useState(false)
  const [processing, setProcessing] = React.useState(false)
  const [valid,setValid] = React.useState(null)
  const [msg, setmsg] = React.useState('')
  const [id, setID] = React.useState('')
  const isFocused = useIsFocused();
  const [rescan, setRescan] = React.useState(true)

  const flashOn = ()=> {
    setFlash(prevFlash => !prevFlash)
  }

  const verification = async () => {
    try{
      console.log('......id is,', id)
        var resp = await rpc.get_table_rows({
          json: true, // Get the response as json
          code: 'immunityproo', // Contract that we target
          scope: 'immunityproo', // Account that owns the data
          table: 'certificates', // Table name
          table_key: 'cashid', // Table secondary key name
          key_type: 'sha256', // Table secondary key name
          index_position: 2,
          lower_bound: id, // Table secondary key value
          upper_bound: id, //Auth.getProfile().eosId, // Table secondary key value
          limit: 1 // Here we limit to 1 to get only row
        });
        setProcessing(false)
        if(resp.rows.length === 0){
          setmsg('User was not found')
          setValid(false)
          setModal(true)
        }else if(resp.rows[0].immunity === 1) {
          setmsg('User has immunity')
          setValid(true)
          setModal(true)
        }else{
          setmsg('User does NOT have immunity')
          setValid(false)
          setModal(true)
        }

    } catch(e) {
      setProcessing(false)
      setValidation(false)
      setRescan(true)
      console.log('\nCaught exception: ' + e);
      if (e instanceof RpcError)
        console.log(JSON.stringify(e.json, null, 2));
    }
  };

  const barcodeRecognized = async ({ barcodes }) => {
    console.log('processing.........', processing, rescan)
    barcodes.forEach(async (barcode) => {
        if (barcodes && barcodes.length && !processing && rescan){
        // setID(barcodes[0].data)
          setProcessing(true)
          setRescan(false)
        setID('6d627f0ee4cf643c9771e431850df957f12260fa335b4c76b1897f2ad40bb252')
          await verification()
        }
    })

  }


const updateState = () => {
  setModal(false)
  //ONLY RESCAN AFTER USER HAS CLICKED OK
  setRescan(true)
}

  if(isFocused){
    return(
      <ScrollView style={styles.container}>
        <RNCamera
          ref={ref => {
            camera = ref;
          }}
          type={RNCamera.Constants.Type.back}
          captureAudio={false}
          flashMode={flash?RNCamera.Constants.FlashMode.torch:RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={barcodeRecognized}
          style={styles.preview}
        >
          {/*<TouchableHighlight style={{position:'absolute', top:10, right:10, borderRadius:50, zIndex:100, backgroundColor:'rgba(255,255,255,0.7)'}} onPress={flashOn} >*/}
          {/*  <Image  source={flash?require("../../images/_Active.png"):require("../../images/_Idle.png")} />*/}
          {/*</TouchableHighlight>*/}
          {/*<Icon type="Entypo" onPress={takePicture} style={styles.icon} name={"flickr-with-circle"} />*/}
        </RNCamera>
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
          {processing? <Text style={[styles.text, {backgroundColor:'rgba(243, 241, 239, 1)', padding: 20}]}>{processing?"Processing . . .":null}</Text> : null}
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={()=>setModal(false)}
        >
          <View style={[{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'},{backgroundColor: `${valid?'rgba(0, 128, 0, 0.5)':'rgba(255, 0, 0, 0.5)'}`}]}>
            <View style={{backgroundColor:'rgba(255,255,255,0.8)', padding:20, justifyContent:'center',alignItems:'center'}}>
              <Text style={[styles.text,{justifyContent:'center',alignItems:'center'}]}>{msg}</Text>
              <Image style={{ height:50, width:50 }} source={valid?require('../../images/green-tick.png'):require('../../images/red-x.png')} resizeMode="contain" />

              <Text style={styles.text}>{}</Text>

              <TouchableHighlight style={{backgroundColor:`${valid?'green':'red'}`,padding:5,width:100, marginTop:10, justifyContent:'center', alignItems:'center', borderRadius:20}} title="Dismiss" onPress={updateState}>
                <Text style={styles.text}> OK </Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </ScrollView>
    )
  }else if(!isFocused){
    return null
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  preview: {
    flex: 1,
    alignItems: 'center',
    overflow: "hidden",
    justifyContent: 'flex-end',
    width: '100%',
    height:400
  },
  textInput: {
    height:40,
    width: '50%',
    alignSelf: 'center',
    paddingLeft: 6,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'grey',
    backgroundColor: 'rgba(243, 241, 239, 0.8)'

  },
  texts: {
    margin: 20,
    fontSize: 18,
    alignSelf: 'center'
  },
  text: {
    fontSize:23
  },
  icon: {
    flex: 0,
    color: 'white',
    fontSize: 40,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  spinnerStyle: {
    flex: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '40',
    width: '40',
    alignSelf: 'flex-start',
  },
  button:{
    fontSize: 20,
    color:'#FFFFFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    margin: 50,
    justifyContent:'center',
    alignItems: 'center',
    alignSelf: 'center',
    height:44,
    borderRadius:7,
    backgroundColor: '#FF652F',
    marginBottom:100,
    width:'70%',
    overflow:"hidden"
  },
});

export default QrVerification;
