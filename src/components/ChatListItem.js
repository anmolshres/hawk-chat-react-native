import React, { useState, useContext, useEffect } from 'react';
import { List } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import getUserInfo from '../utils/getUserInfo';
import { AuthContext } from '../navigation/AuthProvider';

export const ChatListItem = ({ item }) => {
  const [title, setTitle] = useState(item.name);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function getOtherParticipant(participants) {
      const otherParticipant = participants.filter(
        (oneUser) => oneUser !== user.email
      );
      const otherUser = await getUserInfo(otherParticipant[0]);
      setTitle(otherUser.displayName);
    }
    if (item.type === 'private') getOtherParticipant(item.participants);
  }, []);

  return (
    <List.Item
      title={title}
      description={item.latestMessage.text}
      titleNumberOfLines={1}
      titleStyle={styles.listTitle}
      descriptionStyle={styles.listDescription}
      descriptionNumberOfLines={1}
    />
  );
};
const styles = StyleSheet.create({
  listTitle: {
    fontSize: 22,
  },
});
export default ChatListItem;
