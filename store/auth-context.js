import {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Authorisation from '../Authorization/Authorization';
import {jwtDecode} from 'jwt-decode';

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
  const [userEmail, setUserEmail] = useState('');
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '723652959437-v87sc5hmd5veo3j53pje6q7r7vh3a6no.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  async function onGoogleButtonPress() {
    try {
      const GoogleSignInhasPlayServices = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      Authorisation.GoogleSignin(GoogleSignInhasPlayServices);
      const {idToken, user} = await GoogleSignin.signIn();
      setToken(idToken);
      storeUserData(user);
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      Authorisation.login(idToken);
      const lastReturnData = await auth().signInWithCredential(
        googleCredential,
      );
      setIsAuthenticated(!!idToken);
      return lastReturnData;
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      } else {
      }
    }
  }

  const storeUserData = async userData => {
    try {
      const jsonUserData = JSON.stringify(userData);
      await AsyncStorage.setItem('userData', jsonUserData);
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
    Authorisation.login(token.idToken);
    setUserEmail(token.email);
    setToken(token.idToken);
    setIsAuthenticated(!!token.idToken);
  };

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('aud');
        if (storedToken != null || storedToken != undefined) {
          const decodedToken = jwtDecode(storedToken);
          Authorisation.setAuthUser(decodedToken);
          Authorisation.checkTokenExpiry();
          setToken(storedToken);
          setIsAuthenticated(!!storedToken);
          Authorisation.GoogleSignin(false);
        }
        const storedUserEmail = await AsyncStorage.getItem('userEmail');
        setUserEmail(storedUserEmail);
      } catch (error) {
        console.error('Error loading auth data from AsyncStorage:', error);
      }
    };

    loadAuthData();
  }, [isAuthenticated]);

  const logout = async () => {
    await AsyncStorage.removeItem('aud');
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('userEmail');
    setUserEmail('');
    setToken('');
    setIsAuthenticated(false);
    const googleKey = (await AsyncStorage.getItem('isGoogle')) != null;
    if (googleKey) {
      await signOut();
    }
  };
  const contextValue = {
    token,
    isAuthenticated,
    authenticate,
    logout: logout,
    userEmail,
    onGoogleButtonPress,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
