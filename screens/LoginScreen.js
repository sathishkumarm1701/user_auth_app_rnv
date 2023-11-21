import {Alert} from 'react-native';
import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import {login} from '../util/auth';
import {useContext, useState} from 'react';
import {AuthContext} from '../store/auth-context';

function LoginScreen() {
  const [isAuthenticating, setIsAuthnticating] = useState(false);
  const authCtx = useContext(AuthContext);
  async function loginHandler({email, password}) {
    setIsAuthnticating(true);
    try {
      const credentialsResponse = await login(email, password);
      authCtx.authenticate(credentialsResponse);
    } catch (error) {
      Alert.alert(
        'Authentication failed',
        'Please check your credentials and try again!',
      );
      setIsAuthnticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message={'Logging You in...'} />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
