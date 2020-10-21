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

const statusType = 'accepted' | 'pending' | 'rejected';

const CertificateStatus = ({navigation, userToken}) => {
  const [filterValue, setFilterValue] = React.useState(1);
  const [filterLabel, setFilterLabel] = React.useState('pending');
  const [cert, setCert] = React.useState(null);
  const [wait, setWait] = React.useState(true)
    const [refresh, setRefresh] = React.useState(false);
    let un = () => {};

  const filterCertificateStatus = (label)=> {
    label === 'all' ? getAllTests() : getFilteredTests(label)
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


  //on load page get tests based on default label
  React.useEffect(()=> {
    getFilteredTests(filterLabel);
    return  () => un();
    }, []);

    const onRefresh = React.useCallback(() => {
      setRefresh(false)
      getFilteredTests(filterLabel)
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
              selectedValue={filterValue}
              style={{ height: 200 }}
              onValueChange={(itemValue) => {
                DropdownCertificateStatusFilterOptions.forEach((item) => {
                  if (item.value == itemValue) {
                    setFilterValue(itemValue);
                    setFilterLabel(item.label)
                    filterCertificateStatus(item.label.toLowerCase())
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

const mapStateToProps = (state) => ({
  userToken: state.auth.userToken
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
