import {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FIREBASE_AUTH} from '../util/auth-config';
import {Alert} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const auth = FIREBASE_AUTH;

// console.log(auth);
export const AuthContext = createContext({
  token: '',
  isAuthenticated: false,
  authenticate: token => {},
  logout: () => {},
  checkTokenAvailable: () => {},
  userEmail: '',
  onGoogleButtonPress: () => {},
});
export function AuthContextProvider({children}) {
  const [authToken, setAuthToken] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [tokenExpTime, setTokenExpTime] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '723652959437-v87sc5hmd5veo3j53pje6q7r7vh3a6no.apps.googleusercontent.com',
    });
  }, []);

  async function onGoogleButtonPress() {
    // debugger

    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();
      console.log(idToken);
      setAuthToken(idToken)
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log(googleCredential);
      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  const authenticate = async token => {
    // console.log(token.idToken);
    setAuthToken(token.idToken);
    setUserEmail(token.email);
    setTokenExpTime(token.expiresIn);
    setRefreshToken(token.refreshToken);
    await checkTokenValidity();
    if (token.idToken && token.expiresIn) {
      await AsyncStorage.setItem('token', token.idToken);
      await AsyncStorage.setItem('TokenExpTime', token.expiresIn);
      await AsyncStorage.setItem('email', token.email);
      await AsyncStorage.setItem('refreshToken', token.refreshToken);
    }
  };
  const checkTokenValidity = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    const storedExpTime = await AsyncStorage.getItem('TokenExpTime');

    if (storedToken && storedExpTime) {
      setAuthToken(storedToken);
      setUserEmail(await AsyncStorage.getItem('email'));
      setTokenExpTime(storedExpTime);
      const expirationTime =
        new Date().getTime() + Number(storedExpTime) * 1000;
      // const expirationTime = parseInt(storedExpTime + new Date().getTime(), 10);
      const timeDiff = expirationTime - Date.now();
      const autoLogoutTime = new Date().getTime();
      // Refresh token if it's about to expire (within 5 minutes)
      if (expirationTime < autoLogoutTime) {
        try {
          // Your auto-logout logic here
          await logout();
        } catch (error) {
          console.error('Error auto-logging out:', error);
        }
      }
    }
  };

  // useEffect(() => {
  //   checkTokenValidity();
  // }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('TokenExpTime');
    await AsyncStorage.removeItem('email');
    setAuthToken('');
    setUserEmail('');
    setTokenExpTime('');
    await auth.signOut();
    Alert.alert('Success ✅', 'Logout successfully');
  };

  const contextValue = {
    tokenExpTime,
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout,
    userEmail,
    refreshToken,
    onGoogleButtonPress,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
