import {useContext, useEffect, useState} from 'react';
import {Alert, StyleSheet, View, Text} from 'react-native';
import AuthForm from './AuthForm';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../store/auth-context';
import GoogleLoginButton from '../../constants/GoogleButton';
import messaging from '@react-native-firebase/messaging';

function AuthContent({isLogin, onAuthenticate}) {
  const navigation = useNavigation();
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });
  const {onGoogleButtonPress} = useContext(AuthContext);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
    }
  }

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log(token);
  };


  
  useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);
  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace('Signup');
    } else {
      navigation.replace('Login');
    }
  }

  function submitHandler(credentials) {
    let {email, confirmEmail, password, confirmPassword} = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length > 6;
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!emailsAreEqual || !passwordsAreEqual))
    ) {
      Alert.alert('Invalid input', 'Please check your entered credentials.');
      setCredentialsInvalid({
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    onAuthenticate({email, password});
  }

  return (
    <View style={styles.backgroundImage}>
      <View style={styles.authContent}>
        <View style={styles.overlay} />
        <AuthForm
          isLogin={isLogin}
          onSubmit={submitHandler}
          credentialsInvalid={credentialsInvalid}
        />
        <View style={styles.buttons}>
          {!isLogin ? (
            <Text style={{color: '#ffffff'}} onPress={switchAuthModeHandler}>
              Already a member?{' '}
              <Text style={styles.underline}>Log in instead</Text>
            </Text>
          ) : (
            <Text style={{color: '#ffffff'}} onPress={switchAuthModeHandler}>
              Don't have an account?{' '}
              <Text style={styles.underline}>Create a new user</Text>
            </Text>
          )}
        </View>
        <View style={{padding: 10}}>
          <GoogleLoginButton onGoogleButtonPress={onGoogleButtonPress} />
        </View>
      </View>
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  underline: {
    textDecorationLine: 'underline',
    color: '#000000', // Your desired color
    borderRadius: 8,
    padding: 4,
    elevation: 2,
    alignItems: 'center',
  },
  authContent: {
    marginTop: 14,
    marginHorizontal: 12,
    padding: 16,
    width: 300,
  },
  buttons: {
    marginTop: 8,
    elevation: 2,
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#93A8AC',
    opacity: 0.5,
    borderRadius: 10,
  },
  buttonBackground: {
    borderRadius: 8,
    padding: 4,
  },
});
