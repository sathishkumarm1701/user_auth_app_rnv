import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Alert} from 'react-native';
class Authorisation {
  constructor() {
    this.authUser = null;
  }

  async setAuthUser(token) {
    this.authUser = token;
    return this.authUser;
  }

  async getAuthUser() {
    if (await this.isLoggedIn()) {
      await this.setAuthUser();
    }
    return this.authUser != null ? this.authUser : null;
  }

  async checkTokenExpiry() {
    try {
      let token;
      const authUser = await this.authUser;
      if (!authUser) {
        console.log('No authenticated user found.');
        return;
      } else {
        token = authUser;
      }

      if (token && token.exp) {
        const currentTime = new Date().getTime();
        const expiryTime = token.exp * 1000;

        if (expiryTime <= currentTime) {
          await this.refreshAuthToken();
        } else {
          const timeUntilExpiry = expiryTime - currentTime;
          console.log(
            `Token is valid, checking again in ${timeUntilExpiry} ms.`,
          );
          setTimeout(async () => {
            await this.checkTokenExpiry();
          }, timeUntilExpiry);
        }
      } else {

        console.log('Token does not have an exp field.');
      }
    } catch (err) {
      console.error('An error occurred while checking token expiry:', err);
    }
  }

  async isLoggedIn() {
    return typeof (await AsyncStorage.getItem('aud')) === 'string';
  }

  async login(jwtToken) {
    await AsyncStorage.removeItem('aud');
    await AsyncStorage.setItem('aud', jwtToken);
  }

  async GoogleSignin(isGoogle) {
    await AsyncStorage.setItem('isGoogle', String(isGoogle));
  }

  async logout() {
    await auth().signOut();
    await GoogleSignin.signOut();
    await AsyncStorage.removeItem('aud');
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('userDate');
    Alert.alert('Success ✅', 'Logout successfully');
  }
}

export default new Authorisation();
