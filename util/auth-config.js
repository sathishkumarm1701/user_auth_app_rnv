// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {
  getAuth,
} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC4XfiuArN1gqyj5y5DA4wtiojAHOypJes',
  authDomain: 'rnauth-91576.firebaseapp.com',
  projectId: 'rnauth-91576',
  storageBucket: 'rnauth-91576.appspot.com',
  messagingSenderId: '723652959437',
  appId: '1:723652959437:web:3facc8e59803d5c4715d84',
  measurementId: 'G-4WXB8B3XCG',
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const FIREBASE_DB = getFirestore(FIREBASE_APP);

// Uncomment the following code to enable AsyncStorage for Firebase Auth persistence
// const authWithAsync = initializeAuth(FIREBASE_AUTH, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
// });
export {FIREBASE_AUTH, FIREBASE_DB};
