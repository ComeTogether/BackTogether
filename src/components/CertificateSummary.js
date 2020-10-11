import React from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {B} from '../components';
import {connect} from 'react-redux';


const CertificateSummary = ({userToken, route, navigation}) => {
 
  const {id, authority, issueDate, testType, result, status, role} = route.params;
  console.log(status, role);
    const backfunc = () => {
      navigation.goBack();
    }

    const handleStatusChange = (newStatus) => {
      alert(newStatus);
    };

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
        <View style={{ flexDirection: 'column', marginHorizontal:18, paddingVertical:20, paddingHorizontal:40, borderBottomRightRadius:10, borderBottomLeftRadius:10, backgroundColor:'white' }}>
            <View style={page.infos_view}>
              <Text style={page.infos}>
                <B>Authority:</B>             
              </Text>
              <Text style={page.infos}>
                {authority}
              </Text>
            </View>
            <View style={page.infos_view}>
              <Text style={page.infos}>
                <B>Test Type: </B>
              </Text>
              <Text style={page.infos}>
                {testType}
              </Text>
            </View>
            <View style={page.infos_view}>
              <Text style={page.infos}>
                <B>Date: </B>
              </Text>
              <Text style={page.infos}>
                {issueDate}
              </Text>
            </View>
            <View style={page.infos_view}>
              <Text style={page.infos}>
                <B>Result: </B>
              </Text>
              <Text style={page.infos}>
                {result?'Positive':'Negative'}
              </Text>
            </View>
            <View style={page.infos_view}>
              <Text style={page.infos}>
                <B>Status: </B>
              </Text>
              <Text style={page.infos}>
                {status.charAt(0).toUpperCase() +status.slice(1)}
              </Text>
            </View>
            {/* @TODO change to role==admin, this is just for test */}
            {/* conditionally show the approve/reject buttons when role is admin */}
            { role == "user" && (
            <>
              <TouchableOpacity
                  style={page.submitButton}
                  onPress={() => handleStatusChange('approved')}
                >
                  <Image style={{width:18, height:18, marginEnd: 2}} source={require('../../images/green-tick.png')} />
                  <Text style={page.submitButtonText}> Approve </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={page.submitButton}
                onPress={() => handleStatusChange('rejected')}
              >
                <Image style={{width:18, height:18, marginEnd: 10}} source={require('../../images/red-x.png')} />
                <Text style={page.submitButtonText}> Reject </Text>
              </TouchableOpacity>
          </>)}
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
    flexDirection: 'row',
    marginVertical: 5,
  },
  infos: {
    flex: 1,
    fontSize: 18,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgb(0,103,187)",
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 15,
  },
  submitButtonText: {
    color: "white",
    margin: "auto",
    textAlign: "center",
  },
})

export default connect(mapStateToProps)(CertificateSummary);