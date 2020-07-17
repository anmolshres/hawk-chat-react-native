import 'react-native-gesture-handler';
import React from 'react';
import Providers from './src/navigation';
import * as firebase from 'firebase';
import { firebaseConfig } from './config.firebase';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default function App() {
  return <Providers />;
}
