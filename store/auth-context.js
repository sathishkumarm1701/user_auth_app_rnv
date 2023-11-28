import {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

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
      offlineAccess: true,
    });
  }, []);

  async function onGoogleButtonPress() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken, user} = await GoogleSignin.signIn();
      console.log(idToken);
      console.log(user);
      await storeUserData(user);
      setAuthToken(idToken);
      const googleCredential = await auth.GoogleAuthProvider.credential(
        idToken,
      );
      console.log(googleCredential);
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

  const storeUserData = async userData => {
    try {
      const jsonUserData = JSON.stringify(userData);
      await AsyncStorage.setItem('userData', jsonUserData);
      console.log('User data stored successfully.');
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };
  const signOut = async () => {
    try {
      // await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const authenticate = async token => {
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
      const timeDiff = expirationTime - Date.now();
      const threshold = 60 * 60 * 1000; // 60 minutes in milliseconds
      console.log(timeDiff);
      console.log(threshold);
      if (timeDiff < new Date().getTime()) {
        console.log('checkTokenValidity=timeDiff');
        try {
          // Perform token refresh logic if needed
          const refreshedToken = await auth().currentUser.getIdToken(
            /* forceRefresh */ true,
          );
          setAuthToken(refreshedToken);
          await AsyncStorage.setItem('token', refreshedToken);
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }
    }
  };

  useEffect(() => {
    checkTokenValidity();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('TokenExpTime');
    await AsyncStorage.removeItem('email');
    setAuthToken('');
    setUserEmail('');
    setTokenExpTime('');
    await auth().signOut();
    await signOut();
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
