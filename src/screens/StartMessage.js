import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { IconButton, Title, Searchbar } from 'react-native-paper';
import firebaseApp from '../../firebase';
import useStatsBar from '../utils/useStatusBar';
import Loading from '../components/Loading';
import SearchResults from '../components/SearchResults';

const { width, height } = Dimensions.get('screen');

export default function StartMessage({ navigation }) {
  useStatsBar('dark-content');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [textOptions, setTextOptions] = useState([]);

  useEffect(() => {
    const unsubscribe = firebaseApp
      .firestore()
      .collection('USERS')
      .onSnapshot((querySnapshot) => {
        const currentResult = querySnapshot.docs.map((singleDoc) =>
          singleDoc.data()
        );
        setTextOptions([...textOptions, ...currentResult]);
      });

    setLoading(false);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    handleSearchPress();
  }, [searchQuery]);

  if (loading) {
    return <Loading />;
  }
  /**
   * Create a new Firestore collection to save threads
   */
  function handleAddThread(roomName) {
    if (roomName.length > 0) {
      firebaseApp
        .firestore()
        .collection('THREADS')
        .add({
          name: roomName,
          latestMessage: {
            text: `You have joined the room ${roomName}.`,
            createdAt: new Date().getTime(),
          },
        })
        .then((docRef) => {
          docRef.collection('MESSAGES').add({
            text: `You have joined the room ${roomName}.`,
            createdAt: new Date().getTime(),
            system: true,
          });
          navigation.navigate('Home');
        });
    }
  }

  function openProfile() {
    navigation.navigate('MyProfile');
  }

  function handleSearchPress() {
    if (searchQuery == '') {
      setSearchResults([]);
      return;
    }
    const cleanedQuery = searchQuery.toLowerCase().replace(/ /g, '');
    const results = textOptions.filter((option) => {
      return option.displayName
        .concat(option.email)
        .toLowerCase()
        .replace(/ /g, '')
        .includes(cleanedQuery);
    });
    setSearchResults([...results]);
  }

  return (
    <View style={styles.rootContainer}>
      <View style={styles.closeButtonContainer}>
        <IconButton
          icon="close-circle"
          size={36}
          color="#9a4502"
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={styles.innerContainer}>
        <Title style={styles.title}>Search group or student</Title>
        <Searchbar
          style={styles.input}
          placeholder="Search"
          onChangeText={(query) => setSearchQuery(query)}
          value={searchQuery}
          enablesReturnKeyAutomatically
        />
        <SearchResults
          matches={searchResults}
          searchQuery={searchQuery}
          handleAddThread={handleAddThread}
          openProfile={openProfile}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  buttonLabel: {
    fontSize: 22,
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    width: width / 1.5,
    height: height / 15,
  },
});