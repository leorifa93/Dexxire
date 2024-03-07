const {
  onDocumentWritten,
  onDocumentCreated,
  onDocumentUpdated,
  onDocumentDeleted,
  Change,
  FirestoreEvent
} =  require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

exports.userUpdate = onDocumentUpdated("Users/{userId}", async (event) => {
  const userBefore = event.data.before.data();
  const userAfter = event.data.after.data();

  const snapshot = await admin.firestore().collection('Chats').where('memberIds', 'array-contains', userAfter.id).get();
  const chatsDoc = snapshot.docChanges();

  if (userBefore.profilePictures.original !== userAfter.profilePictures.original) {
    for (let doc of chatsDoc) {
      let chat = doc.doc.data();
  
      for (let profile of chat.profiles) {
        if (profile.id === userAfter.id) {
          profile.profilePictures = userAfter.profilePictures;
          admin.firestore().collection('Chats').doc(doc.doc.id).set(chat);
        }
      }
    }
  }
});
