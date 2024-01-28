const {
  onDocumentWritten,
  onDocumentCreated,
  onDocumentUpdated,
  onDocumentDeleted,
} =  require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const badgeService = require('../services/badge');

exports.gotFriendRequest = onDocumentCreated('FriendRequests/{userId}/Users/{sentFrom}', (event) => {

});
