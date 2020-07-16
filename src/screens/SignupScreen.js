import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, IconButton } from 'react-native-paper';
import { firestore } from 'firebase';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [year, setYear] = useState('');
  const [major, setMajor] = useState('');
  const [hometown, setHometown] = useState('');

  const { register, user } = useContext(AuthContext);

  function createProfile(currentUser) {
    console.log("HELLO");

    return new Promise(function (resolve, reject) {
      try {
        firestore()
          .collection('USERS')
          .add({
            userID: currentUser.uid,
            email: currentUser.email,
            firstName: first,
            lastName: last,
            classYear: year,
            major: major,
            hometown: hometown,
          })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      } catch (e) {
        console.log(e);
        reject();
      }
    });
  }

  return (
      <View style={styles.container}>
        <Title style={styles.titleText}>Register to chat</Title>
        <FormInput
          labelName='Email'
          keyboardType='email-address'
          value={email}
          autoCapitalize='none'
          onChangeText={userEmail => setEmail(userEmail)}
        />
        <FormInput
          labelName='Password'
          value={password}
          secureTextEntry={true}
          onChangeText={userPassword => setPassword(userPassword)}
        />
        <FormInput
          labelName='First name'
          value={first}
          placeholder='John'
          autoCapitalize='words'
          onChangeText={first => setFirst(first)}
        />
        <FormInput
          labelName='Last name'
          value={last}
          placeholder='Simon'
          autoCapitalize='words'
          onChangeText={last => setLast(last)}
        />
        <FormInput
          labelName='Class Year'
          value={year}
          keyboardType="numeric"
          placeholder="2024"
          onChangeText={year => setYear(year)}
        />
        <FormInput
          labelName='Major'
          value={major}
          placeholder='Computer Science'
          autoCapitalize='words'
          onChangeText={major => setMajor(major)}
        />
        <FormInput
          labelName='Hometown'
          value={hometown}
          placeholder="Bethlehem, PA"
          autoCapitalize='words'
          onChangeText={hometown => setHometown(hometown)}
        />
        <FormButton
          title='Signup'
          modeValue='contained'
          labelStyle={styles.loginButtonLabel}
          onPress={() => {
            if (first.length && last.length && year.length && major.length && hometown.length) {
              register(email, password)
                .then((user) => createProfile(user.user))
            } else {
              alert("Please fill in all fields");
            }
          }}
        />
        <IconButton
          icon='keyboard-backspace'
          size={30}
          style={styles.navButton}
          color='#6646ee'
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f5f5f5',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    titleText: {
      fontSize: 24,
      marginBottom: 10
    },
    loginButtonLabel: {
      fontSize: 22
    },
    navButtonText: {
      fontSize: 18
    },
    navButton: {
      marginTop: 10
    }
  });
