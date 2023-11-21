import {useState} from 'react';
import {Alert, StyleSheet, View, ImageBackground} from 'react-native';
import FlatButton from '../ui/FlatButton';
import AuthForm from './AuthForm';
import {useNavigation} from '@react-navigation/native';

function AuthContent({isLogin, onAuthenticate}) {
  const navigation = useNavigation();
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });

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
    <ImageBackground
      source={require('../../screens/placeholders/pexels-cottonbro-studio-4069292.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.authContent}>
        <AuthForm
          isLogin={isLogin}
          onSubmit={submitHandler}
          credentialsInvalid={credentialsInvalid}
        />
        <View style={styles.buttons}>
          <FlatButton
            onPress={switchAuthModeHandler}
            style={styles.buttonBackground}>
            {isLogin ? 'Create a new user' : 'Log in instead'}
          </FlatButton>
        </View>
      </View>
    </ImageBackground>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
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
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    height: 700,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#EEB1D9', // Your desired fade color
    opacity: 0.5, // Adjust the opacity as needed
  },
  buttonBackground: {
    backgroundColor: '#BF4694', // Your desired button background color
    padding: 10, // Adjust padding as needed
    borderRadius: 8, // Adjust border radius as needed
  },
});
