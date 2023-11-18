// import {createContext, useState} from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// export const AuthContext = createContext({
//   token: '',
//   isAuthenticated: false,
//   authenticate: token => {},
//   logout: () => {},
// });

// export function AuthContextProvider({children}) {
//   const [authToken, setAuthToken] = useState();

//   const authenticate = token => {
//     setAuthToken(token);
//     AsyncStorage.setItem('token', token);
//   };

//   function logout() {
//     setAuthToken(null);
//     AsyncStorage.removeItem('token');
//   }

//   const value = {
//     token: authToken,
//     isAuthenticated: !!authToken,
//     authenticate: authenticate,
//     logout: logout,
//   };
//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

import {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({
  token: '',
  isAuthenticated: false,
  authenticate: token => {},
  logout: () => {},
});

export function AuthContextProvider({children}) {
  const [authToken, setAuthToken] = useState('');
  const [tokenExpiration, setTokenExpiration] = useState(0); // Store expiration time

  useEffect(() => {
    checkTokenValidity(); // Check token validity on component mount
  }, []);

  const authenticate = token => {
    setAuthToken(token);
    const expirationTime = new Date().getTime() + 3600000; // Set expiration time to 1 hour from now
    setTokenExpiration(expirationTime);
    AsyncStorage.setItem('token', token);
    AsyncStorage.setItem('tokenExpiration', expirationTime.toString()); // Store expiration time
  };

  const logout = () => {
    setAuthToken('');
    setTokenExpiration(0); // Clear expiration time
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('tokenExpiration'); // Remove stored expiration time
  };

  const checkTokenValidity = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    const storedExpiration = await AsyncStorage.getItem('tokenExpiration');
    if (storedToken && storedExpiration) {
      const expirationTime = parseInt(storedExpiration);
      if (expirationTime > new Date().getTime()) {
        setAuthToken(storedToken);
        setTokenExpiration(expirationTime);
      } else {
        // Token has expired, logout user
        logout();
      }
    }
  };

  useEffect(() => {
    const tokenTimer = setTimeout(() => {
      // Check if the token has expired
      if (tokenExpiration && tokenExpiration <= new Date().getTime()) {
        logout(); // Logout if token has expired
      }
    }, 1000); // Check every second for token expiration

    return () => clearTimeout(tokenTimer); // Clear timer on component unmount
  }, [tokenExpiration]);

  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
