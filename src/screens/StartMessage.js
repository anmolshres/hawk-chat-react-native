import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { IconButton, Title, Searchbar } from 'react-native-paper';
import firebaseApp from '../../firebase';
import useStatsBar from '../utils/useStatusBar';
import Loading from '../components/Loading';
import SearchResults from '../components/SearchResults';
import { AuthContext } from '../navigation/AuthProvider';
import getUserInfo from '../utils/getUserInfo';
import getThreadFromId from '../utils/getThreadFromId';

const { width, height } = Dimensions.get('screen');

export default function StartMessage({ navigation }) {
  useStatsBar('dark-content');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [textOptions, setTextOptions] = useState([]);
  const [threadOptions, setThreadOptions] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribePeople = firebaseApp
      .firestore()
      .collection('USERS')
      .onSnapshot((querySnapshot) => {
        const currentResult = querySnapshot.docs.map((singleDoc) => {
          return { _id: singleDoc.id, ...singleDoc.data() };
        });
        const toPush = currentResult.filter((current) => {
          return current.email !== user.email;
        });
        setTextOptions([...toPush]);
      });

    const unsubscribeThreads = firebaseApp
      .firestore()
      .collection('THREADS')
      .where('type', '==', 'group')
      .onSnapshot((querySnapshot) => {
        const currentResult = querySnapshot.docs.map((singleDoc) => {
          return { _id: singleDoc.id, ...singleDoc.data() };
        });
        setThreadOptions([...currentResult]);
      });

    setLoading(false);

    return () => {
      unsubscribePeople();
      unsubscribeThreads();
    };
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
      getUserInfo(user.email).then((currUser) => {
        firebaseApp
          .firestore()
          .collection('THREADS')
          .add({
            name: roomName,
            latestMessage: {
              text: `${currUser.displayName} created ${roomName} 🥳`,
              createdAt: new Date().getTime(),
            },
            participants: [currUser.email],
            type: 'group',
          })
          .then(async (docRef) => {
            docRef.collection('MESSAGES').add({
              text: `${currUser.displayName} created ${roomName} 🥳`,
              createdAt: new Date().getTime(),
              system: true,
            });
            const currThread = await getThreadFromId(docRef.id.toString());
            navigation.navigate('Room', { thread: currThread });
          });
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
    const peopleResults = textOptions.filter((option) => {
      return option.displayName
        .concat(option.email)
        .toLowerCase()
        .replace(/ /g, '')
        .includes(cleanedQuery);
    });
    const threadResults = threadOptions.filter((option) => {
      return option.name.toLowerCase().replace(/ /g, '').includes(cleanedQuery);
    });
    setSearchResults([...peopleResults, ...threadResults]);
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
          navigation={navigation}
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
