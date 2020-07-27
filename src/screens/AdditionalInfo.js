import React, { useContext, useState } from 'react';
import FormInput from '../components/FormInput';
import { Title, IconButton } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import FormButton from '../components/FormButton';
import createProfile from '../utils/createProfile';

export default function AdditionalInfo({ navigation }) {
  const { logout } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [year, setYear] = useState('');
  const [major, setMajor] = useState('');
  const [hometown, setHometown] = useState('');

  function handleSubmit() {
    if (displayName.length && year.length && major.length && hometown.length) {
      createProfile(user, displayName, year, major, hometown);
      navigation.navigate('ChatApp');
    } else {
      alert('Please fill in all fields');
    }
  }

  return (
    <View style={styles.container}>
      <Title style={styles.titleText}>Register to chat</Title>
      <FormInput
        labelName="Name"
        value={displayName}
        placeholder="John Simon"
        autoCapitalize="words"
        onChangeText={(displayName) => setDisplayName(displayName)}
      />
      <FormInput
        labelName="Class Year"
        value={year}
        keyboardType="numeric"
        placeholder="2024"
        onChangeText={(year) => setYear(year)}
      />
      <FormInput
        labelName="Major"
        value={major}
        placeholder="Computer Science"
        autoCapitalize="words"
        onChangeText={(major) => setMajor(major)}
      />
      <FormInput
        labelName="Hometown"
        value={hometown}
        placeholder="Bethlehem, PA"
        autoCapitalize="words"
        onChangeText={(hometown) => setHometown(hometown)}
      />
      <FormButton
        title="Signup"
        modeValue="contained"
        labelStyle={styles.loginButtonLabel}
        disabled={
          !(
            displayName.length &&
            year.length &&
            major.length &&
            hometown.length
          )
        }
        onPress={() => handleSubmit()}
      />
      <IconButton
        icon="keyboard-backspace"
        size={30}
        style={styles.navButton}
        onPress={() => logout()}
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
    fontSize: 18,
  },
  navButton: {
    marginTop: 10,
  },
});
