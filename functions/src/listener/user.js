const {
  onDocumentWritten,
  onDocumentCreated,
  onDocumentUpdated,
  onDocumentDeleted,
  Change,
  FirestoreEvent
} =  require("firebase-functions/v2/firestore");

exports.userUpdate = onDocumentUpdated("Users/{userId}", (event) => {
  //console.log(event.data.before.data());
});
