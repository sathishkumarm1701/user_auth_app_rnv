import {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FIREBASE_AUTH} from '../util/auth-config';

const auth = FIREBASE_AUTH;

console.log(auth);
export const AuthContext = createContext({
  token: '',
  isAuthenticated: false,
  authenticate: token => {},
  logout: () => {},
  checkTokenAvailable: () => {},
  userEmail: '',
});
export function AuthContextProvider({children}) {
  const [authToken, setAuthToken] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [tokenExpTime, setTokenExpTime] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
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
      debugger;
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

  auth.onAuthStateChanged(user => {
    debugger;
    if (user) {
      console.log('User is signed in:', user.uid);
    } else {
      console.log('No user is signed in');
    }
  });

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
    await auth.signOut();
  };

  const authenticate = async token => {
    console.log(token.idToken);
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
  const contextValue = {
    tokenExpTime,
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout,
    userEmail,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
