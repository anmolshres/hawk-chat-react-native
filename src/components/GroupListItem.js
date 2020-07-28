import React, { useContext } from 'react';
import { List, Avatar, IconButton } from 'react-native-paper';
import { StyleSheet, Dimensions } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import firebaseApp from '../../firebase';
import getUserInfo from '../utils/getUserInfo';

const { width, height } = Dimensions.get('screen');
const firebase = require('firebase/app');

export const GroupListItem = ({ match, openProfile, navigation }) => {
  const { user } = useContext(AuthContext);

  function updateThreadDatabase(roomId) {
    firebaseApp
      .firestore()
      .collection('THREADS')
      .doc(roomId)
      .get()
      .then((currData) => {
        const roomParticipants = currData.data().participants;
        const isParticipant = roomParticipants.includes(user.email);
        if (!isParticipant) {
          firebaseApp
            .firestore()
            .collection('THREADS')
            .doc(roomId)
            .update({
              participants: firebase.firestore.FieldValue.arrayUnion(
                user.email
              ),
            });
          getUserInfo(user.email).then((currUser) => {
            firebaseApp
              .firestore()
              .collection('THREADS')
              .doc(roomId)
              .collection('MESSAGES')
              .add({
                text: `${currUser.displayName} has entered the chat 🧐`,
                createdAt: new Date().getTime(),
                system: true,
              });

            firebaseApp
              .firestore()
              .collection('THREADS')
              .doc(roomId)
              .set(
                {
                  latestMessage: {
                    text: `${currUser.displayName} has entered the chat 🧐`,
                    createdAt: new Date().getTime(),
                  },
                },
                { merge: true }
              );
          });
        }
      });
  }

  return (
    <List.Item
      title={match.name}
      left={() => <Avatar.Icon size={30} icon="account-group" />}
      right={() => (
        <IconButton
          size={30}
          icon="pencil"
          onPress={() => {
            updateThreadDatabase(match._id);
            navigation.navigate('Room', { thread: match });
          }}
        />
      )}
      style={styles.result}
      key={match.name}
      onPress={() => openProfile()}
    />
  );
};

const styles = StyleSheet.create({
  result: {
    marginTop: 10,
    marginBottom: 10,
    width: width / 1.5,
    height: height / 25,
  },
});

export default GroupListItem;
