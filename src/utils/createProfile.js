import firebaseApp from '../../firebase';

export default function createProfile(
  currentUser,
  displayName,
  year,
  major,
  hometown
) {
  return new Promise(function (resolve, reject) {
    try {
      firebaseApp
        .firestore()
        .collection('USERS')
        .add({
          userID: currentUser.uid,
          email: currentUser.email,
          displayName: displayName,
          classYear: year,
          major: major,
          hometown: hometown,
          avatar: currentUser.photoURL,
        })
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    } catch (e) {
      console.log(e);
      reject();
    }
  });
}
