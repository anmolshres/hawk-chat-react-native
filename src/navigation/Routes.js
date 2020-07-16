import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { auth, firestore } from 'firebase';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';
import WelcomeStack from './WelcomeStack';
import { AuthContext } from './AuthProvider';
import Loading from '../components/Loading';

export default function Routes() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    if (user) {
      hasProfile(user);
    } else {
      setLoading(false);
    }
  }

  function hasProfile(user) {
    console.log(user.toJSON().uid);
    firestore().collection("USERS").where("userID", "==", user.toJSON().uid)
      .get()
      .then(function (querySnapshot) {
        setProfile(!querySnapshot.empty);
      }).catch(function (error) {
        console.log("Error getting documents: ", error);
      }).finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {user ? (profile ? <HomeStack /> : <WelcomeStack />) : <AuthStack />}
    </NavigationContainer>
  );
}
