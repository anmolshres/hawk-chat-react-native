import * as React from 'react';
import { List, Avatar, IconButton } from 'react-native-paper';
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');

export const GroupListItem = ({ match, openProfile, navigation }) => {
  return (
    <List.Item
      title={match.name}
      left={() => <Avatar.Icon size={30} icon="account-group" />}
      right={() => (
        <IconButton
          size={30}
          icon="pencil"
          onPress={() => navigation.navigate('Room', { thread: match })}
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
