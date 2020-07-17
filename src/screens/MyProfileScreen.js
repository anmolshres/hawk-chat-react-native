import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Title, IconButton } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import useStatsBar from '../utils/useStatusBar';

export default function MyProfileScreen({ navigation }) {
  useStatsBar('dark-content');

return (
    <View style={styles.rootContainer}>
      <View style={styles.closeButtonContainer}>
        <Text>First Last</Text>
        <IconButton
          icon='close-circle'
          size={36}
          color='#6646ee'
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={styles.innerContainer}>
        <Title style={styles.title}>My Profile</Title>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 1
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    marginTop: 1
  },
  buttonLabel: {
    fontSize: 22
  }
});