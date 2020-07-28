import React, { useContext } from 'react';
import { List, Avatar, IconButton } from 'react-native-paper';
import { StyleSheet, Dimensions } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import firebaseApp from '../../firebase';
import getUserInfo from '../utils/getUserInfo';
import generateHash from '../utils/generateHash';
import getThreadFromId from '../utils/getThreadFromId';

const { width, height } = Dimensions.get('screen');

export const PersonListItem = ({ match, openProfile, navigation }) => {
  const { user } = useContext(AuthContext);

  function handleAddPrivateMessage(targetName) {
    if (targetName) {
      const hash = generateHash([targetName.email, user.email].sort().join(''));
      firebaseApp
        .firestore()
        .collection('THREADS')
        .doc(hash.toString().concat('private'))
        .get()
        .then(async (check) => {
          if (!check.exists) {
            getUserInfo(user.email).then((currUser) => {
              firebaseApp
                .firestore()
                .collection('THREADS')
                .doc(hash.toString().concat('private'))
                .set({
                  name: `Private thread between ${currUser.email} and ${targetName.email}`,
                  latestMessage: {
                    text: `${currUser.displayName} started a conversation with ${targetName.displayName}.`,
                    createdAt: new Date().getTime(),
                  },
                  participants: [currUser.email, targetName.email],
                  type: 'private',
                })
                .then(() => {
                  firebaseApp
                    .firestore()
                    .collection('THREADS')
                    .doc(hash.toString().concat('private'))
                    .collection('MESSAGES')
                    .get()
                    .then(async (currData) => {
                      if (!currData.docs.length) {
                        firebaseApp
                          .firestore()
                          .collection('THREADS')
                          .doc(hash.toString().concat('private'))
                          .collection('MESSAGES')
                          .add({
                            text: `${currUser.displayName} started a conversation with ${targetName.displayName}.`,
                            createdAt: new Date().getTime(),
                            system: true,
                          })
                          .then(async () => {
                            const currThread = await getThreadFromId(
                              hash.toString().concat('private')
                            );
                            navigation.navigate('Room', { thread: currThread });
                          });
                      }
                    });
                });
            });
          } else {
            const currThread = await getThreadFromId(
              hash.toString().concat('private')
            );
            navigation.navigate('Room', { thread: currThread });
          }
        });
    }
  }

  return (
    <List.Item
      title={match.displayName.concat(` (${match.email.replace(/@.*/g, '')})`)}
      left={() =>
        match.avatar ? (
          <Avatar.Image size={30} source={{ uri: match.avatar }} />
        ) : (
          <Avatar.Icon size={30} icon="account" />
        )
      }
      right={() => (
        <IconButton
          size={30}
          icon="pencil"
          onPress={() => handleAddPrivateMessage(match)}
        />
      )}
      style={styles.result}
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

export default PersonListItem;
