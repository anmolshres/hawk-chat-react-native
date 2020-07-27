import * as React from 'react';
import { List, Avatar } from 'react-native-paper';
import { StyleSheet, Dimensions } from 'react-native';
import PersonListItem from './PersonListItem';
import GroupListItem from './GroupListItem';

const { width, height } = Dimensions.get('screen');

export const SearchResults = ({
  matches,
  searchQuery,
  handleAddThread,
  openProfile,
  navigation
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
        if (match.displayName) {
          return (
            <PersonListItem
              match={match}
              openProfile={openProfile}
              key={match.email}
            />
          );
        } else {
          return (
            <GroupListItem
              match={match}
              openProfile={openProfile}
              key={match.name}
              navigation={navigation}
            />
          );
        }
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
