import React from 'react';
import { FlatList, SafeAreaView, Text, Platform, View, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { Test, Splash } from '../components';
import firestore from "@react-native-firebase/firestore";
import {connect} from 'react-redux';


const CertificateHistory = ({navigation, userToken}) => {

    const [cert, setCert] = React.useState(null);
    const [wait, setWait] = React.useState(true)
    const [refresh, setRefresh] = React.useState(false);
    let un = () => {};

    React.useEffect(()=>{
      const subscriber = firestore()
      .collection("tests")
      .where('email', '==', userToken.email)
      .get()
      .then((res) => {
        if (res.docs.length !== 0) {
         un = firestore()
            .collection("tests")
            .doc(res.docs[0].ref.id)
            .onSnapshot((documentSnapshot) => {
              setCert(documentSnapshot.data().tests);
            });
        }
        setWait(false);


      })
      .catch((error) => {
        alert( error)
      })
      return  () => un();
    }, [])

    const onRefresh = React.useCallback(() => {
        setRefresh(true)
        firestore()
      .collection("tests")
      .where('email', '==', userToken.email)
      .get()
      .then((res) => {
        if (res.docs.length !== 0) {
          firestore()
            .collection("tests")
            .doc(res.docs[0].ref.id)
            .onSnapshot((documentSnapshot) => {
              setCert(documentSnapshot.data().tests);
            });
          }
      })
      .then(()=>setRefresh(false))
      .catch((error) => {
        alert( error)
      })
    },[refresh])

    const onSelect = React.useCallback((id, authority, issueDate, testType, result) => {
      navigation.navigate('Summary',{id:id, authorityName:authority, issueDate:issueDate, testType:testType, result:result})
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
          <SafeAreaView style={{flex:1, backgroundColor:'#efeff5'}}>
              <Text style={{fontSize:22, textAlign:'center', marginTop:20}}>Certificate History</Text>
              {cert?<FlatList
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
                  renderItem={({item}) => (
                      <Test
                          id={item.testId}
                          title={item.testType}
                          date={item.issueDate}
                          expiration={item.expireDate}
                          result={item.result}
                          onSelect={() => onSelect(item.testId, item.authorityName, item.issueDate, item.testType, item.result)}
                      />
                  )}
                  keyExtractor={item=>item.testId}
              />
          :
          (
          <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor: '#efeff5',}}>
            <Image style={{width:48, height:70, opacity: 0.9, marginVertical:6}} source={require('../../images/summary.png')}  />
            <Text style={{fontSize:20, color:'rgb(0,103,189)'}}>No Certifications Available!</Text>
          </View>
          )
        }
        </SafeAreaView>

      )
    }
}

const mapStateToProps = (state) => ({
  userToken: state.auth.userToken
})

export default connect(mapStateToProps)(CertificateHistory)
