import axios from 'axios';
import {FIREBASE_AUTH} from './auth-config';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {Alert} from 'react-native';

const auth = FIREBASE_AUTH;
export function cleanEmail(email) {
  const atIndex = email.indexOf('@');
  const checkedMail = email.substring(0, atIndex);
  return checkedMail;
}

export async function createUser(email, password) {
  // return authenticate('signUp', email, password);
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log(response._tokenResponse);
    if (response && response.user) {
      Alert.alert('signUp ✅', 'successfully');
    }
    return response._tokenResponse;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function login(email, password) {
  // return authenticate('signInWithPassword', email, password);
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    console.log(response._tokenResponse);
    if (response && response.user) {
      Alert.alert('Success ✅', 'Authenticated successfully');
    }
    return response._tokenResponse;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// const provider = new GoogleAuthProvider();
// export let signInWithGoogle = () => {
//   signInWithPopup(auth, provider)
//     .then(result => {
//       const credential = GoogleAuthProvider.credentialFromResult(result);
//       console.log(credential);
//       const token = credential.accessToken;
//       const user = result.user;
//       navigation.navigate('Home');
//       console.log(user);
//     })
//     .catch(error => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       const email = error.customData.email;
//       const credential = GoogleAuthProvider.credentialFromError(error);
//       console.log(errorCode, errorMessage, email, credential);
//     });
// };
