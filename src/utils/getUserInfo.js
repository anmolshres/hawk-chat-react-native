import firebaseApp from '../../firebase';

export const getUserInfo = async (email) => {
  const user = await firebaseApp
    .firestore()
    .collection('USERS')
    .where('email', '==', email.replace(/ /g, ''))
    .get();
  return user.docs[0].data();
};

export default getUserInfo;
