import React from 'react';
import {Text, TouchableOpacity, Image} from 'react-native';
import {AuthContext} from '../../App';
import { useNavigation } from '@react-navigation/native';



// export default function Settings({navigation}) {
//    const { signOut } = React.useContext(AuthContext);
//    return (
//       <View style={styles.container}>
//          <TouchableOpacity style = {styles.optionButton} onPress={() => navigation.navigate('PrivacyPolicy')} >
//             <Text style = {styles.optionButtonText}> Privacy Policy </Text>
//          </TouchableOpacity>
//          <TouchableOpacity style = {styles.optionButton} onPress={() => navigation.navigate('TermsOfUse')}>
//             <Text style = {styles.optionButtonText}> Terms of Use </Text>
//          </TouchableOpacity>
//          <TouchableOpacity style = {styles.optionButton} onPress={() => navigation.navigate('ChangePassword')}>
//             <Text style = {styles.optionButtonText}> Reset Password </Text>
//          </TouchableOpacity>
//          <TouchableOpacity style = {styles.optionButton} onPress={() => navigation.navigate('DeleteAccount')}>
//             <Text style = {styles.optionButtonText}> Delete Account </Text>
//          </TouchableOpacity>
//          <TouchableOpacity style = {styles.optionButton} onPress={async ()=> {await signOut()}}>
//             <Text style = {styles.optionButtonText}> Logout </Text>
//          </TouchableOpacity>
//       </View>
//    );
// }

export default function Settings({icon, name, to}) {
   
   const navigation = useNavigation();

   const moveToOpts = () => {
      navigation.navigate(to)
   }

   return(
      <TouchableOpacity style={{flexDirection:'row', flex:1, marginHorizontal:18, marginVertical:10}} onPress={()=> moveToOpts()}>
         <Image style={{width:24, height:24, marginRight:18}} source={icon} />
         <Text style={{fontWeight:'bold', fontSize:18}}>
            {name}
         </Text>
      </TouchableOpacity>
   )
}

