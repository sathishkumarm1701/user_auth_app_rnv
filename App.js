import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Image, StatusBar, TouchableOpacity, View} from 'react-native';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import {Colors} from './constants/styles';
import {AuthContext, AuthContextProvider} from './store/auth-context';
import {useContext, useEffect, useState} from 'react';
import IconButton from './components/ui/IconButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import OnboardingScreen from './screens/Onboarding';
import UserPage from './screens/UserPage';
import {useNavigation} from '@react-navigation/native';
import {retrieveUserData} from './util/auth';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="OnboardingScreen"
      screenOptions={{
        headerStyle: {backgroundColor: Colors.primary500},
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

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const navigation = useNavigation();
  const navigationHandler = () => {
    navigation.navigate('UserDetails');
  };
  const userDetailsGetHandler = async () => {
    try {
      const userData = await retrieveUserData();
      console.log(userData);
      setUserDetails(userData);
    } catch (error) {
      console.error('Error retrieving user details:', error);
    }
  };

  useEffect(() => {
    userDetailsGetHandler();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: Colors.primary500},
        headerTintColor: 'white',
        contentStyle: {backgroundColor: Colors.primary100},
      }}>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={({navigation}) => ({
          headerRight: () => {
            const userImageURL = userDetails && userDetails.photo;
            return userImageURL ? (
              <TouchableOpacity onPress={navigationHandler}>
                <Image
                  source={{uri: userImageURL}}
                  style={{
                    width: 35,
                    height: 35,
                    marginRight: 10,
                    borderRadius: 20,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: 'green',
                  }}
                />
              </TouchableOpacity>
            ) : null;
          },
          // headerStyle: {backgroundColor: Colors.primary500},
          // headerTintColor: 'white',
          // contentStyle: {backgroundColor: Colors.primary100},
        })}
      />
      <Stack.Screen
        options={{
          headerRight: ({tintColor}) => (
            <IconButton
              icon="exit"
              color={tintColor}
              size={24}
              onPress={authCtx.logout}
            />
          ),
        }}
        name="UserDetails"
        component={UserPage}
      />
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
      const storedToken = await AsyncStorage.getItem('token');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedExpTime = await AsyncStorage.getItem('TokenExpTime');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const listCred = {
        idToken: storedToken,
        email: storedEmail,
        expiresIn: storedExpTime,
        refreshToken: refreshToken,
      };
      if (storedToken && storedEmail && storedExpTime) {
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
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
