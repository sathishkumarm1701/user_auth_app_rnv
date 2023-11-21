import {createContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const authenticate = async token => {
    setAuthToken(token.idToken);
    setUserEmail(token.email);
    setTokenExpTime(token.expiresIn);
    await checkTokenAvailable();
    if (token.idToken && token.expiresIn) {
      await AsyncStorage.setItem('token', token.idToken);
      await AsyncStorage.setItem('TokenExpTime', token.expiresIn);
      await AsyncStorage.setItem('email', token.email);
    }
  };

  const checkTokenAvailable = async () => {
    const token = await AsyncStorage.getItem('token');
    const TokenExpTime = await AsyncStorage.getItem('TokenExpTime');
    const expirationTime = new Date().getTime() + Number(TokenExpTime) * 1000;
    if (Number(TokenExpTime) === 3600 && token) {
      const interval = setInterval(() => {
        const currentTime = new Date().getTime();
        if (currentTime >= expirationTime) {
          clearInterval(interval);
          logout(); // Logout when expired
          return;
        }
      }, 60000); // Check every minutes
    }
  };

  const logout = async () => {
    setAuthToken(null);
    setUserEmail(null);
    setTokenExpTime(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('TokenExpTime');
  };

  const value = {
    tokenExpTime: tokenExpTime,
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
    userEmail: userEmail,
    checkTokenAvailable: checkTokenAvailable,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
