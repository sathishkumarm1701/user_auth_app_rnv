import axios from 'axios';
import {FIREBASE_AUTH} from './auth-config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

// const API_KEY = 'AIzaSyC4XfiuArN1gqyj5y5DA4wtiojAHOypJes';

// async function authenticate(mode, email, password) {
//   const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
//   const response = await axios.post(url, {
//     email: email,
//     password: password,
//     returnSecureToken: true,
//   });
//   return response.data;
// }

const auth = FIREBASE_AUTH;
export async function createUser(email, password) {
  // return authenticate('signUp', email, password);
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log(response._tokenResponse);
    return response._tokenResponse;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function login(email, password) {
  // return authenticate('signInWithPassword', email, password);
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    console.log(response._tokenResponse);
    return response._tokenResponse;
  } catch (error) {
    console.log(error);
    return error;
  }
}
