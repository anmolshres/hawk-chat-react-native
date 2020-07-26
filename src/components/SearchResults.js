import * as React from 'react';
import { List } from 'react-native-paper';
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');

export const SearchResults = () => (
  <List.Section style={styles.allResults}>
    <List.Item
      title="First Item"
      left={() => <List.Icon icon="folder" />}
      style={styles.result}
    />
    <List.Item
      title="Second Item"
      left={() => <List.Icon color="#000" icon="folder" />}
      style={styles.result}
    />
  </List.Section>
);

const styles = StyleSheet.create({
  allResults: {
    marginTop: -15,
  },
  result: {
    marginTop: 10,
    marginBottom: 10,
    width: width / 1.5,
    height: height / 25,
  },
});

export default SearchResults;
