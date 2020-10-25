import { users } from "../../users";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export const resetPassUser = async (oldPass, newPass) => {
  const user = auth().currentUser;
  const provider = auth.EmailAuthProvider;
  const authCredential = provider.credential(user.email, oldPass);
  await auth()
    .currentUser.reauthenticateWithCredential(authCredential)
    .then((data) => {
      user
        .updatePassword(newPass)
        .then(() => {return true;});
    })
    .catch((err) => {return false;});
};

export const deleteUser = async (password) => {
  const user = auth().currentUser;
  const provider = auth.EmailAuthProvider;
  const authCredential = provider.credential(user.email, password);
  const userid = user.uid;

  await auth()
    .currentUser.reauthenticateWithCredential(authCredential)
    .then((data) => {
      firestore()
        .collection("users")
        .doc(userid)
        .get()
        .then((doc) => {
          if (!doc.empty) {
            doc.docs[0].ref.delete();
          }
        });
      user.delete().then(() => {return true});
    })
    .catch((err) => {
      return false;
    });
};
