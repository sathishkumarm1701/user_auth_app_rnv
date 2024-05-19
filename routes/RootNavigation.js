import {useNavigation} from '@react-navigation/native';
import IconButton from '../components/ui/IconButton';
import UserPage from '../screens/UserPage';
import {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../store/auth-context';
import {retrieveUserData} from '../util/auth';
import WelcomeScreen from '../screens/WelcomeScreen';
import {Stack} from '../helper';
import {AppColors} from '../constants/styles';
import {TouchableOpacity, Image} from 'react-native';

export default function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const navigation = useNavigation();

  const navigationHandler = () => {
    navigation.navigate('UserDetails');
  };

  const userDetailsGetHandler = async () => {
    try {
      const userData = await retrieveUserData();
      setUserDetails(userData);
    } catch (error) {
      console.error('Error retrieving user details:', error);
    }
  };

  useEffect(() => {
    userDetailsGetHandler();
  }, []);

  const rootNavigationArray = [
    {
      name: 'Welcome',
      component: WelcomeScreen,
      options: {
        headerRight: ({tintColor}) => {
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
          ) : (
            <IconButton
              icon="exit"
              color={tintColor}
              size={24}
              onPress={authCtx.logout}
            />
          );
        },
      },
    },
    {
      name: 'UserDetails',
      component: UserPage,
      options: {
        headerRight: ({tintColor}) => (
          <IconButton
            icon="exit"
            color={tintColor}
            size={24}
            onPress={authCtx.logout}
          />
        ),
      },
    },
  ];

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: AppColors.primary500},
        headerTintColor: 'white',
        contentStyle: {backgroundColor: AppColors.primary100},
      }}>
      {rootNavigationArray.map((screen, index) => {
        return (
          <Stack.Screen
            key={index}
            name={screen.name}
            component={screen.component}
            options={screen.options}
          />
        );
      })}
    </Stack.Navigator>
  );
}
