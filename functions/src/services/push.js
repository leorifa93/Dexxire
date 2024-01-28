const admin = require("firebase-admin");
const badge = require("./badge");

exports.sendPush = (to, payload, type, data) => {
  if ((to._deviceIds && to._deviceIds.length === 0)
    || !to._deviceIds
    || (type === 'friend' && !to._settings.notifications.friendRequests)
    || (type === 'messages' && !to._settings.notifications.messages)
    || (type === 'likes' && !to._settings.notifications.likes)) {
    return false;
  }


  let notification = Object.assign({
    click_action: "FCM_PLUGIN_ACTIVITY",
    badge: badge.get(to).toString()
  }, payload);

  if (!payload.title) {
    payload.title = 'Dexxire';
  }

  let body = {
    notification: notification
  };

  if (data) {
    body.data = data;
  }

  return admin.messaging().sendToDevice(to._deviceIds, body);
}
