import {useContext, useState} from 'react';
import AuthContent from '../components/Auth/AuthContent';
import {createUser} from '../util/auth';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import {Alert} from 'react-native';
import {AuthContext} from '../store/auth-context';

function SignupScreen() {
  const [isAuthenticating, setIsAuthnticating] = useState(false);

  const authCtx = useContext(AuthContext);
  async function signUpHandler({email, password}) {
    setIsAuthnticating(true);
    try {
      const createUserResponse = await createUser(email, password);
      authCtx.authenticate(createUserResponse);
    } catch (error) {
      Alert.alert(
        'Authentication failed',
        'Could not create user, please check your input and try again later.',
      );
      setIsAuthnticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message={'Creating User...'} />;
  }
  return <AuthContent onAuthenticate={signUpHandler} />;
}

export default SignupScreen;
