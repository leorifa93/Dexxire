const admin = require("firebase-admin");

exports.set = async (user, property, count) => {
  if (user) {
    if (!user._badges) {
      user._badges = {}
    }

    user._badges[property] = count;

    return admin.firestore().collection('Users').doc(user.id).set(user).then(() => user);
  }

  return false;
}

exports.get = (user) => {
  let badge = 0;

  if (user._badges) {
    if (user._badges?.likes) {
      badge += user._badges.likes
    }
  }

  if (user._friendRequests) {
    badge += user._friendRequests.length;
  }

  return badge;
}
