import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyDCUsjfrCtgrLASBS2kB2BI4B7xQIiD9tE',
  authDomain: 'hawk-chat-react-native.firebaseapp.com',
  databaseURL: 'https://hawk-chat-react-native.firebaseio.com',
  projectId: 'hawk-chat-react-native',
  storageBucket: 'hawk-chat-react-native.appspot.com',
  messagingSenderId: '608302673417',
  appId: '1:608302673417:web:c2b77270d4098d505a12d8',
  measurementId: 'G-TE950MBYEF',
});

export default firebaseApp;
