import React from 'react';
import {
  FlatList,
  Text,
  View,
  Image,
  ActivityIndicator,
  RefreshControl,
  StyleSheet
} from 'react-native';
import { Test } from '../components';
import firestore from "@react-native-firebase/firestore";
import {connect} from 'react-redux';
import {Picker} from "@react-native-community/picker";
import {DropdownCertificateStatusFilterOptions} from "../data";
import {setCertificateStatusFilterLabel} from "../../actions";

const CertificateStatus = ({navigation, userToken, certificateStatusFilterLabel, dispatch}) => {
  const [cert, setCert] = React.useState(null);
  const [wait, setWait] = React.useState(true);
  const [refresh, setRefresh] = React.useState(false);


  const getTests = (filter) => {

    const cleanData = (data) => {
      const certificates = data.reduce((flat, toFlatten) => {
        return flat.concat({...toFlatten.data(), ref: toFlatten.ref});
      }, []);
      setCert(certificates);
    }
    setWait(true);
    let query = firestore()
      .collection("TestsDev");
    // conditionally add extra where clause if we don't want All the tests
    if (filter !== 'all') {
      query = query.where('status', '==', filter);
    }
    query = query
      .where('authorityUid', '==', userToken.authorityUid)
      .get()
      .then((res) => {
        if (res.docs){
          cleanData(res.docs)
        }
        setWait(false);
      })
      .catch((error) => {
        alert(error)
      })
  };

  // function passed to CertificateSummary to change the ticket status
  const handleStatusChange = async (testRef, newStatus) => {
    const subscriber = testRef.update({
      status: newStatus,
    }).then(() =>{
      getTests(certificateStatusFilterLabel);
    })
    .catch((error) => {
      alert( error)
    })

  };

  const handleDropdownChange = (newFilter) => {
    getTests(newFilter);
    dispatch(setCertificateStatusFilterLabel(newFilter));
   
  }

  //on load page get tests based on current filter
  React.useEffect(() => {
    getTests(certificateStatusFilterLabel);
  }, []);

    const onRefresh = React.useCallback(() => {
      setRefresh(false)
      getTests(certificateStatusFilterLabel);
    },[refresh]);

  const onSelect = React.useCallback((id, authority, issueDate, testType, result, ref) => {
      navigation.navigate('Summary',{id:id, authorityName: authority, issueDate: issueDate, testType: testType, result: result, ref: ref})
    })
    if(wait){
      return(
        <View style={{flex:1, justifyContent:'center', backgroundColor:'#efeff5'}}>
          <ActivityIndicator size='large' color='rgb(0, 103, 187)' />
        </View>
      )
    }
    else {
      return(
        <View>
              <Text style={{fontSize:22, textAlign:'center', marginTop:20}}>Certificate Status</Text>
          <View style={styles.typeDropdown}>
            <Picker
              selectedValue={certificateStatusFilterLabel}
              style={{ height: Platform.OS === 'ios' ? 200 : 40 }}
              onValueChange={handleDropdownChange}
            >
              {DropdownCertificateStatusFilterOptions.map((filterOption, index) => {
                return (
                  <Picker.Item
                    key={index}
                    label={filterOption}
                    value={filterOption.toLowerCase()}
                  />
                );
              })}
            </Picker>
          </View>

          {cert ? <FlatList
                  data={cert}
                  ItemSeparatorComponent={
                    () => (
                      <View
                        style={
                           { marginTop: 5 }
                        }
                      />
                    )
                  }
                  ListHeaderComponent= { () => (
                    <View
                      style={{ paddingTop:10 }}
                    />
                  )}
                  refreshControl={
                    <RefreshControl
                        colors={["#ff862f", "#FF652F"]}
                        refreshing={refresh}
                        onRefresh={onRefresh} />
                  }
                  renderItem={({item, index}) => (
                      <Test
                          id={index}
                          title={item.testType}
                          date={item.issueDate}
                          result={item.result}
                          role={userToken.role}
                          status={item.status}
                          onSelect={() => onSelect(index, item.authorityName, item.issueDate, item.testType, item.result, item.ref)}
                      />
                  )}
                  keyExtractor={(item, index) =>index.toString()}
              />
          :
          (
          <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor: '#efeff5',}}>
            <Image style={{width:48, height:70, opacity: 0.9, marginVertical:6}} source={require('../../images/summary.png')}  />
            <Text style={{fontSize:20, color:'rgb(0,103,189)'}}>No Certifications Available!</Text>
          </View>
          )
        }
        </View>
      )
    }
};

const mapStateToProps = (state, dispatch) => ({
  userToken: state.auth.userToken,
  certificateStatusFilterLabel: state.filters.certificateStatusFilterLabel,
  dispatch
});

export default connect(mapStateToProps)(CertificateStatus)


const styles = StyleSheet.create({

  typeDropdown: {
    marginHorizontal: 18,
    marginBottom: 2,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 18
  }
});
