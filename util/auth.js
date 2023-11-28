import {FIREBASE_AUTH} from './auth-config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const auth = FIREBASE_AUTH;
export function cleanEmail(email) {
  const splitedName = email.split('@');
  return splitedName[0];
}

export async function createUser(email, password) {
  // return authenticate('signUp', email, password);
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
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

export const retrieveUserData = async () => {
  try {
    const storedUserData = await AsyncStorage.getItem('userData');
    if (storedUserData !== null) {
      const parsedUserData = JSON.parse(storedUserData);
      return parsedUserData;
    } else {
      Alert.alert('No user data found.');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving user data:', error);
  }
};
