import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Title } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import * as WebBrowser from 'expo-web-browser';
import {
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
  useAutoDiscovery,
  generateHexStringAsync,
} from 'expo-auth-session';
import firebase from 'firebase';

WebBrowser.maybeCompleteAuthSession();

const useProxy = Platform.select({ web: false, default: true });

// Generate a random hex string for the nonce parameter
function useNonce() {
  const [nonce, setNonce] = useState(null);
  useEffect(() => {
    generateHexStringAsync(16).then((value) => setNonce(value));
  }, []);
  return nonce;
}

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const { login } = useContext(AuthContext);
  const nonce = useNonce();
  // Endpoint
  const discovery = useAutoDiscovery('https://accounts.google.com');
  // Request
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.IdToken,
      // PKCE must be disabled in implicit mode
      usePKCE: false,
      clientId:
        '608302673417-snphqqp2n2735eli50phr9o5rnsrarlb.apps.googleusercontent.com',
      redirectUri: makeRedirectUri({
        // For usage in bare and standalone
        // native: 'com.googleusercontent.apps.GOOGLE_GUID://redirect',
        useProxy,
      }),
      scopes: ['openid', 'profile', 'email'],
      extraParams: {
        nonce,
        login_hint: email,
      },
    },
    discovery
  );
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
      login(credential).then((isNew) => {
        console.log(isNew);
      });
    }
  }, [response]);
  return (
    <View style={styles.container}>
      <Title style={styles.titleText}>Welcome to Hawk Chat!</Title>
      <FormInput
        labelName="Email"
        keyboardType="email-address"
        value={email}
        autoCapitalize="none"
        onChangeText={(userEmail) => setEmail(userEmail)}
      />
      <FormButton
        title="Login"
        modeValue="contained"
        labelStyle={styles.loginButtonLabel}
        onPress={() => {
          promptAsync({ useProxy });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10,
  },
  loginButtonLabel: {
    fontSize: 22,
  },
  navButtonText: {
    fontSize: 16,
  },
});
