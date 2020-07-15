import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Title, IconButton } from 'react-native-paper';
import { firestore } from 'firebase';
import { AuthContext } from '../navigation/AuthProvider';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import useStatsBar from '../utils/useStatusBar';

export default function WelcomeScreen({ navigation }) {
    useStatsBar('dark-content');

    const { user } = useContext(AuthContext);
    const currentUser = user.toJSON();

    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [year, setYear] = useState('');
    const [major, setMajor] = useState('');
    const [hometown, setHometown] = useState('');

    function createProfile() {
        return new Promise(function (resolve, reject) {
            try {
                firestore()
                    .collection('USERS')
                    .add({
                        userID: currentUser.uid,
                        email: currentUser.email,
                        firstName: first,
                        lastName: last,
                        classYear: year,
                        major: major,
                        hometown: hometown,
                    });
                resolve();
            } catch (e) {
                console.log(e);
                reject();
            }
        });

    }

    return (
        <View style={styles.rootContainer}>
            <View style={styles.closeButtonContainer}>
                <Title style={styles.title}>Welcome to Hawk Chat!</Title>
                <Text>Please enter some info so we can help match you!</Text>
                <FormInput
                    labelName='First name'
                    value={first}
                    placeholder='John'
                    autoCapitalize='words'
                    onChangeText={first => setFirst(first)}
                />
                <FormInput
                    labelName='Last name'
                    value={last}
                    placeholder='Simon'
                    autoCapitalize='words'
                    onChangeText={last => setLast(last)}
                />
                <FormInput
                    labelName='Class Year'
                    value={year}
                    keyboardType="numeric"
                    placeholder="2024"
                    onChangeText={year => setYear(year)}
                />
                <FormInput
                    labelName='Major'
                    value={major}
                    placeholder='Computer Science'
                    autoCapitalize='words'
                    onChangeText={major => setMajor(major)}
                />
                <FormInput
                    labelName='Hometown'
                    value={hometown}
                    placeholder="Bethlehem, PA"
                    autoCapitalize='words'
                    onChangeText={hometown => setHometown(hometown)}
                />
                <FormButton
                    title='Set my info'
                    modeValue='contained'
                    labelStyle={styles.loginButtonLabel}
                    onPress={() => {
                        createProfile().then(() => {
                            navigation.goBack();
                        });

                    }}
                />
            </View>
            <View style={styles.innerContainer}>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1
    },
    closeButtonContainer: {
        top: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        marginTop: 1
    },
    buttonLabel: {
        fontSize: 22
    }
});