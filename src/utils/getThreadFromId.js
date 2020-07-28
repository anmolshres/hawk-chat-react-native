import firebaseApp from '../../firebase';

export const getThreadFromId = async (id) => {
  const thread = await firebaseApp
    .firestore()
    .collection('THREADS')
    .doc(id)
    .get();
  return { _id: thread.id, ...thread.data() };
};

export default getThreadFromId;
