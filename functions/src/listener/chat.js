const {
  onDocumentWritten,
  onDocumentCreated,
  onDocumentUpdated,
  onDocumentDeleted,
} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const badgeService = require('../services/badge');
const pushService = require('../services/push');

exports.onMessage = onDocumentCreated('Chats/{chatId}/Messages/{messageId}', async (event) => {
  const message = event.data.data();
  const chatId = event.params.chatId;
  const chatDoc = await admin.firestore().collection('Chats').doc(chatId).get();
  const chat = chatDoc.data();
  const otherUserId = chat.memberIds.filter(id => id !== chat.lastMessageFrom)[0];
  const otherUserDoc = await admin.firestore().collection('Users').doc(otherUserId).get();
  const otherUser = otherUserDoc.data();
  const chatsDoc = await admin.firestore().collection('Chats')
    .where('memberIds', 'array-contains', otherUserId)
    .get();
  const me = chat.profiles.filter((user) => user.id === chat.lastMessageFrom)[0];
  let count = 0;

  chatsDoc.docs.forEach((doc) => {
    let chat = doc.data();

    if (!chat.seen.includes(otherUser.id)) {
      count++;
    }
  })

  let translations = require('../i18n/' + (otherUser._settings.currentLang || 'de') + '.json');

  if (message.type === 'image') {

  }

  pushService.sendPush(otherUser, {
    title: translations['HASSENTMESSAGE'] + me.username,
    body: message.type === 'image' ? translations['HASSENTYOUAPICTURE'] : chat.lastMessage,
  }, 'messages', {
    type: 'CHAT',
    userId: chat.lastMessageFrom
  });
});

exports.onChatUpdate = onDocumentWritten('Chats/{chatId}', async (event) => {
  const chat = event.data.after.data();

  if (!chat) return;

  const userIds = chat.profiles.map((profile) => profile.id);

  for (let id of userIds) {
    let count = 0;
    let chatsDoc = await admin.firestore().collection('Chats')
      .where('memberIds', 'array-contains', id)
      .get();
    let userDoc = await admin.firestore().collection('Users').doc(id).get();
    let user = userDoc.data();

    chatsDoc.docs.forEach((doc) => {
      let chat = doc.data();

      if (!chat.seen.includes(id)) {
        count++;
      }
    });

    await badgeService.set(user, 'chats', count);
  }
})
