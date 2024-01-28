const {
  onDocumentWritten,
  onDocumentCreated,
  onDocumentUpdated,
  onDocumentDeleted,
} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const badgeService = require('../services/badge');
const pushService = require('../services/push');

exports.likeCreated = onDocumentCreated("Likes/{sentTo}/Users/{sentFrom}", (event) => likeUpdated(event, true));
exports.likeDeleted = onDocumentDeleted("Likes/{sentTo}/Users/{sentFrom}", (event) => likeUpdated(event));
exports.likeUpdated = onDocumentUpdated("Likes/{sentTo}/Users/{sentFrom}", async (event) => likeUpdated(event))

const likeUpdated = async (event, triggerPush) => {
  const sentTo = event.params.sentTo;
  const sentFrom = event.params.sentFrom;
  const userDoc = await admin.firestore().collection('Users').doc(sentTo).get();
  const userFromDoc = await admin.firestore().collection('Users').doc(sentFrom).get();
  const userFrom = userFromDoc.data();
  const user = userDoc.data();
  const likesCollection = await admin.firestore().collection('Likes').doc(sentTo).collection('Users').listDocuments();
  const unseenLikes = await admin.firestore().collection('Likes').doc(sentTo).collection('Users').where('seen', '==', false).get();

  user.likesCount = likesCollection.length;


  return badgeService.set(user, 'likes', unseenLikes.docs.length).then((u) => {
    if (u && triggerPush) {
      let translations = require('../i18n/' + (u._settings.currentLang || 'de') + '.json');

      pushService.sendPush(u, {
        title: translations['NEWLIKE'],
        body: userFrom.username + translations['HASGOTLIKE'],
      }, 'likes', {
        type: 'LIKE'
      });
    }
  });
}


