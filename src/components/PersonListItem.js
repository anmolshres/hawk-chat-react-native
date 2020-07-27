import * as React from 'react';
import { List, Avatar, IconButton } from 'react-native-paper';
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');

export const PersonListItem = ({ match, openProfile }) => {
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
          onPress={() => console.log(match.displayName)}
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
