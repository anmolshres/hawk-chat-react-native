import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Divider, Text, IconButton } from 'react-native-paper';
import firebaseApp from '../../firebase';
import Loading from '../components/Loading';
import useStatsBar from '../utils/useStatusBar';
import { AuthContext } from '../navigation/AuthProvider';
import ChatListItem from '../components/ChatListItem';

export default function HomeScreen({ navigation }) {
  useStatsBar('light-content');

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  /**
   * Fetch threads from Firestore
   */
  useEffect(() => {
    const unsubscribe = firebaseApp
      .firestore()
      .collection('THREADS')
      .where('participants', 'array-contains', user.email)
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            // give defaults
            name: '',

            latestMessage: {
              text: '',
            },
            ...documentSnapshot.data(),
          };
        });

        setThreads(threads);

        if (loading) {
          setLoading(false);
        }
      });

    /**
     * unsubscribe listener
     */
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {threads.length === 0 ? (
        <View style={styles.emptyMessage}>
          <Text style={styles.text}>
            Press icon below to start connecting🤗
          </Text>
          <IconButton
            icon="message-plus"
            size={28}
            color="#9a4502"
            onPress={() => navigation.navigate('AddRoom')}
          />
        </View>
      ) : (
        <FlatList
          data={threads}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Room', { thread: item })}
            >
              <ChatListItem item={item} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  listDescription: {
    fontSize: 16,
  },
  text: {
    fontSize: 18,
  },
  emptyMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
