import React, { createContext, useState } from 'react';
import firebaseApp from '../../firebase';

/**
 * This provider is created
 * to access user in whole app
 */

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (credential) => {
          try {
            return await (
              await firebaseApp.auth().signInWithCredential(credential)
            ).additionalUserInfo.isNewUser;
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
