import React, { createContext, useState } from 'react';
import firebaseApp from '../../firebase';

/**
 * This provider is created
 * to access user in whole app
 */

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (credential) => {
          try {
            await firebaseApp.auth().signInWithCredential(credential);
          } catch (e) {
            console.log(e);
          }
        },
        logout: async () => {
          try {
            await firebaseApp.auth().signOut();
          } catch (e) {
            console.error(e);
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
