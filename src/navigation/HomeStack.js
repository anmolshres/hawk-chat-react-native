import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import HomeScreen from '../screens/HomeScreen';
import StartMessage from '../screens/StartMessage';
import MyProfileScreen from '../screens/MyProfileScreen';
import RoomScreen from '../screens/RoomScreen';
import { AuthContext } from './AuthProvider';
import AdditionalInfo from '../screens/AdditionalInfo';
import Loading from '../components/Loading';
import firebaseApp from '../../firebase';

const ChatAppStack = createStackNavigator();
const ModalStack = createStackNavigator();

/**
 * All chat app related screens
 */

function ChatApp() {
  const { logout } = useContext(AuthContext);

  return (
    <ChatAppStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#9a4502',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontSize: 22,
        },
      }}
    >
      <ChatAppStack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <View style={styles.iconContainer}>
              <IconButton
                icon="account"
                size={28}
                color="#ffffff"
                onPress={() => navigation.navigate('MyProfile')}
              />
              <IconButton
                icon="message-plus"
                size={28}
                color="#ffffff"
                onPress={() => navigation.navigate('AddRoom')}
              />
            </View>
          ),
          headerLeft: () => (
            <IconButton
              icon="logout-variant"
              size={28}
              color="#ffffff"
              onPress={() => logout()}
            />
          ),
        })}
      />
      <ChatAppStack.Screen
        name="Room"
        component={RoomScreen}
        options={({ route }) => ({
          title: route.params.thread.name,
        })}
      />
    </ChatAppStack.Navigator>
  );
}

export default function HomeStack() {
  const { user } = useContext(AuthContext);
  const [initialRouteName, setInitialRouteName] = useState('');
  checkNewUser(user);
  async function checkNewUser(currentUser) {
    const dbData = await firebaseApp
      .firestore()
      .collection('USERS')
      .where('userID', '==', currentUser.toJSON().uid)
      .get();
    dbData.empty
      ? setInitialRouteName('AdditionalInfo')
      : setInitialRouteName('ChatApp');
  }

  if (!initialRouteName.length) return <Loading />;

  return (
    <ModalStack.Navigator
      mode="modal"
      headerMode="none"
      initialRouteName={initialRouteName}
    >
      <ModalStack.Screen name="ChatApp" component={ChatApp} />
      <ModalStack.Screen name="MyProfile" component={MyProfileScreen} />
      <ModalStack.Screen name="AddRoom" component={StartMessage} />
      <ModalStack.Screen name="AdditionalInfo" component={AdditionalInfo} />
    </ModalStack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    paddingLeft: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: 120,
  },
});
