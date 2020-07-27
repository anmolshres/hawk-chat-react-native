import * as React from 'react';
import { List, Avatar, IconButton } from 'react-native-paper';
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');

export const SearchResults = ({
  matches,
  searchQuery,
  handleAddThread,
  openProfile,
}) => {
  if (searchQuery.length == 0) {
    return null;
  }

  if (matches.length == 0) {
    return (
      <List.Section style={styles.allResults}>
        <List.Item
          title={`Create group "${searchQuery}"`}
          style={styles.result}
          left={() => <Avatar.Icon size={30} icon="forum" />}
          onPress={() => handleAddThread(searchQuery)}
        />
      </List.Section>
    );
  }

  return (
    <List.Section style={styles.allResults}>
      {matches.map((match) => {
        return (
          <List.Item
            title={match.displayName.concat(
              ` (${match.email.replace(/@.*/g, '')})`
            )}
            left={() => (
              <Avatar.Image size={30} source={{ uri: match.avatar }} />
            )}
            right={() => (
              <IconButton
                size={30}
                icon="pencil"
                onPress={(bro) => console.log(match.displayName)}
              />
            )}
            style={styles.result}
            key={match.email}
            onPress={() => openProfile()}
          />
        );
      })}
    </List.Section>
  );
};

const styles = StyleSheet.create({
  allResults: {
    marginTop: -5,
  },
  result: {
    marginTop: 10,
    marginBottom: 10,
    width: width / 1.5,
    height: height / 25,
  },
});

export default SearchResults;
