import React from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {B} from '../components';
import {connect} from 'react-redux';


const CertificateSummary = ({userToken, route, navigation}) => {

  const {id, authorityName, issueDate, testType, result, ref} = route.params;

    const backfunc = () => {
      navigation.goBack();
    }

    return(
      <View style={{flexGrow:1, backgroundColor:'#efeff5'}}>
        <View style={{justifyContent:'center', alignItems:'center', fontSize:20, marginHorizontal:18, marginTop:10, paddingTop:20, borderTopRightRadius:10, borderTopLeftRadius:10, backgroundColor:'white'}}>
            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', alignSelf:'stretch'}}>
              <TouchableOpacity style={{position:'absolute', left:16}} onPress={backfunc}>
                <Image style={{width:24, height:24}} source={require('../../images/back.png')} />
              </TouchableOpacity>
              <Text style={{fontSize:20, textAlign:'center'}}>
                  <B>E-Certificate</B>
              </Text>
            </View>
            <Image style={{width:48, height:70, marginVertical:6}} source={require('../../images/summary.png')}  />
            <Text style={{fontSize:28, textAlign:'center'}}>
              <B>{userToken.fullName}</B>
            </Text>
        </View>
        <View style={{ flexDirection:'row', marginHorizontal:18, paddingVertical:20, borderBottomRightRadius:10, borderBottomLeftRadius:10, backgroundColor:'white' }}>
          <View style={page.infos_view}>
            <Text style={page.infos}>
              <B>Authority:</B>
            </Text>
            <Text style={page.infos}>
              <B>Test Type: </B>
            </Text>
            <Text style={page.infos}>
              <B>Date:</B>
            </Text>
            <Text style={page.infos}>
              <B>Result:</B>
            </Text>
          </View>
          <View style={page.infos_view}>
            <Text style={page.infos}>
              {authorityName}
            </Text>
            <Text style={page.infos}>
              {testType}
            </Text>
            <Text style={page.infos}>
              {issueDate}
            </Text>
            <Text style={page.infos}>
              {result?'Positive':'Negative'}
            </Text>
          </View>
        </View>
      </View>
    )
}
const mapStateToProps = (state,ownProps ) => ({
  userToken: state.auth.userToken,
  route: ownProps.route,
  navigation: ownProps.navigation
  });

const page = StyleSheet.create({
  infos_view: {
    flex: 1,
    flexDirection: 'column',
  },
  infos: {
    flexDirection:'row',
    fontSize: 18,
    marginVertical: 5,
    width:100,
    alignSelf:'center',
  }
})

export default connect(mapStateToProps)(CertificateSummary);
