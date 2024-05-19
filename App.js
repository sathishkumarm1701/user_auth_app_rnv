import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import {AppColors} from './constants/styles';
import {AuthContext, AuthContextProvider} from './store/auth-context';
import {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import OnboardingScreen from './screens/Onboarding';
import {NativeBaseProvider, extendTheme} from 'native-base';
import AuthenticatedStack from './routes/RootNavigation';
import {Stack} from './helper';

const newColorTheme = {
  brand: {
    900: '#8287af',
    800: '#7c83db',
    700: '#b3bef6',
  },
};
const theme = extendTheme({colors: newColorTheme});

// const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="OnboardingScreen"
      screenOptions={{
        headerStyle: {backgroundColor: AppColors.primary500},
        headerTintColor: 'white',
        // contentStyle: {backgroundColor: Colors.primary100},
      }}>
      <Stack.Screen
        options={{headerShown: false}}
        name="OnboardingScreen"
        component={OnboardingScreen}
      />

      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    SplashScreen.hide();
    async function fetchAuthToken() {
      const storedToken = await AsyncStorage.getItem('aud');
      const storedEmail = await AsyncStorage.getItem('email');
      const listCred = {
        idToken: storedToken,
        email: storedEmail,
      };
      if (storedToken != null) {
        authCtx.authenticate(listCred);
      }
    }
    fetchAuthToken();
  }, []);

  return <Navigation />;
}
export default function App() {
  return (
    <>
      <NativeBaseProvider theme={theme}>
        <StatusBar style="light" />
        <AuthContextProvider>
          <Root />
        </AuthContextProvider>
      </NativeBaseProvider>
    </>
  );
}
