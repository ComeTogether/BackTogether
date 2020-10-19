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

const statusType = 'accepted' | 'pending' | 'rejected';

const CertificateStatus = ({navigation, userToken, certificateStatusFilterLabel, dispatch}) => {
  const [filterValue, setFilterValue] = React.useState(1);
  const [cert, setCert] = React.useState(null);
  const [wait, setWait] = React.useState(true);
  const [refresh, setRefresh] = React.useState(false);
  let un = () => {};

  const filterCertificateStatus = ()=> {
    const filter = certificateStatusFilterLabel.toLowerCase()
    filter === 'all' ? getAllTests() : getFilteredTests(filter)
  };

  const getAllTests = () => {
    setWait(true);
    const subscriber = firestore()
      .collection("TestsDev")
      .where('authorityUid', '==', userToken.authorityUid)
      .get()
      .then((res) => {
        if (res.docs){
          const cleanData = res.docs.reduce((flat, toFlatten) => {
            return flat.concat({...toFlatten.data(), ref: toFlatten.ref});
          }, []);
          setCert(cleanData);
        }
        setWait(false);
      })
      .catch((error) => {
        alert( error)
      })
  };


  const getFilteredTests = (label) => {
    setWait(true);
    const subscriber = firestore()
      .collection("TestsDev")
      .where('status', '==', label)
      .where('authorityUid', '==', userToken.authorityUid)
      .get()
      .then((res) => {
        if (res.docs){
          const cleanData = res.docs.reduce((flat, toFlatten) => {
            return flat.concat({...toFlatten.data(), ref: toFlatten.ref});
          }, []);
          setCert(cleanData);
        }
        setWait(false);
      })
      .catch((error) => {
        alert( error)
      })
  };

  // function passed to CertificateSummary to change the ticket status
  const handleStatusChange = async (testRef, newStatus) => {
    const subscriber = testRef.update({
      status: newStatus,
    }).then(() =>{
      filterCertificateStatus();
    })
      .catch((error) => {
        alert( error)
      })

  };

  //on load page get tests based on default label
  React.useEffect(()=> {
    filterCertificateStatus();
    return  () => un();
    }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('..NAVIGATED' , certificateStatusFilterLabel)
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

    const onRefresh = React.useCallback(() => {
      setRefresh(false)
      filterCertificateStatus();
    },[refresh]);



  React.useEffect(() => {
    filterCertificateStatus();
  }, [certificateStatusFilterLabel]);


  const onSelect = React.useCallback((id, authority, issueDate, testType, result, status, ref, certificateStatusFilterLabel) => {
      navigation.navigate('Summary',{id:id, authority: authority, issueDate: issueDate, testType: testType, result: result, status:status, ref: ref, changeStatus: handleStatusChange, parentFilterLabel: certificateStatusFilterLabel})
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
              selectedValue={filterValue}
              style={{ height: Platform.OS === 'ios' ? 200 : 40 }}
              onValueChange={(itemValue) => {
                DropdownCertificateStatusFilterOptions.forEach((item) => {
                  if (item.value === itemValue) {
                    setFilterValue(itemValue);
                    dispatch(setCertificateStatusFilterLabel(item.label));
                  }
                });
              }}
            >
              {DropdownCertificateStatusFilterOptions.map((type, index) => {
                return (
                  <Picker.Item
                    key={index}
                    label={type.label}
                    value={type.value}
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
                          onSelect={() => onSelect(index, item.authority, item.issueDate, item.testType, item.result, item.status, item.ref, certificateStatusFilterLabel)}
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
