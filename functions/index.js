/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

const cert = require('./serviceAccount.json');
const {onSchedule} = require("firebase-functions/v2/scheduler");
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);

adminConfig.credential = admin.credential.cert(cert);
admin.initializeApp(adminConfig);

exports.resetMembership = onSchedule('every day 00:00', async () => {
  const formattedDate = (date) => {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return dd + '.' + mm + '.' + yyyy;
  };
  let currentDate = new Date();
  const users = await admin.firestore().collection('Users')
    .where('membershipExpiredAt', '==', formattedDate(currentDate)).get();
  let messages = [];

  users.docChanges().forEach((doc) => {
    const user = doc.doc.data();
    let translations = require('./src/i18n/' + (user._settings.currentLang || 'de') + '.json');
    let title = translations['MEMBERSHIPEXPIRED'];
    let body = translations['MEMBERSHIPEXPIREDINFO'];

    if (!user.renewMembership) {
      user.membership = 1;
    } else {
      if ((user.membership === 2 && user.availableCoins >= 120) || (user.membership === 3 && user.availableCoins >= 320)) {
        let renewDate;

        if (currentDate.getMonth() == 11) {
          renewDate = new Date(currentDate.getFullYear() + 1, 0, currentDate.getDay());
        } else {
          renewDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDay());
        }

        user.availableCoins -= user.membership === 2 ? 84 : 224;
        user.membershipExpiredAt = formattedDate(renewDate);
        title = translations['MEMBERSHIPRENEWED'];
        body = translations['MEMBERSHIPRENEWEDINFO'];
      } else {
        user.renewMembership = false;
        user.membership = 1;
        title = translations['NOTENOUGHRENEWCOINS'];
        body = translations['MEMBERSHIPRENEWEDINFO'];
      }
    }

    if (user._deviceIds) {
      for (let deviceId of user._deviceIds) {
        messages.push({
          token: deviceId,
          data: {
            type: 'EXPIREDMEMBERSHIP'
          },
          notification: {
            title: title,
            body: body
          }
        });
      }
    }

    admin.firestore().collection('Users').doc(user.id).set(user);
  });

  if (messages.length > 0) {
    admin.messaging().sendEach(messages);
  }
})

exports.setAge = onRequest(async (req, res) => {
  const snapshot = await admin.firestore().collection('Users').get();
  const usersDoc = snapshot.docChanges();

  for (let doc of usersDoc) {
    let data = doc.doc.data();
    data.age = new Date(data.birthday).getTime();

    await admin.firestore().collection('Users').doc(data.id).set(data);
  }

  res.send(true);
});

exports.setBoost = onRequest(async (req, res) => {
  const snapshot = await admin.firestore().collection('Users').get();
  const usersDoc = snapshot.docChanges();

  for (let doc of usersDoc) {
    let data = doc.doc.data();
    data.lastBoostAt = new Date().getTime() / 1000;

    await admin.firestore().collection('Users').doc(data.id).set(data);
  }

  res.send(true);
});

exports.setDefaultSettings = onRequest(async (req, res) => {
  const snapshot = await admin.firestore().collection('Users').get();
  const usersDoc = snapshot.docChanges();

  for (let doc of usersDoc) {
    let data = doc.doc.data();
    data.contacts = {
      phoneNumber: {},
      whatsApp: {}
    }

    await admin.firestore().collection('Users').doc(data.id).set(data);
  }

  res.send(true);
});

exports.handleEmailVerification = onRequest(async (request, response) => {
  if (request.query.userId) {
    const userDoc = await admin.firestore().collection('Users').doc(request.query.userId).get();
    const user = userDoc.data();
    user.isVerified = true;

    admin.firestore().collection('Users').doc(request.query.userId).set(user).then(() => {
      response.send('E-Mail verified!')
    })
  } else {
    response.send(false);
  }
})

exports.invoiceBtcPay = onRequest((req, res) => {
  logger.info(req.body);

  res.send(req.body);
})

exports.notificationBtcPay = onRequest((req, res) => {


  logger.info(req.body);

  res.send(req.body);
});

exports.testMembership = onRequest(async (req, res) => {
  const formattedDate = (date) => {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return dd + '.' + mm + '.' + yyyy;
  };
  let currentDate = new Date();
  const users = await admin.firestore().collection('Users')
    .where('membershipExpiredAt', '==', '04.03.2024').get();
  let messages = [];

  users.docChanges().forEach((doc) => {
    const user = doc.doc.data();
    let translations = require('./src/i18n/' + (user._settings.currentLang || 'de') + '.json');
    let title = translations['MEMBERSHIPEXPIRED'];
    let body = translations['MEMBERSHIPEXPIREDINFO'];

    if (!user.renewMembership) {
      user.membership = 1;
    } else {
      if ((user.membership === 2 && user.availableCoins >= 84) || (user.membership === 3 && user.availableCoins >= 224)) {
        let renewDate;

        if (currentDate.getMonth() == 11) {
          renewDate = new Date(currentDate.getFullYear() + 1, 0, currentDate.getDay());
        } else {
          renewDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDay());
        }

        user.membershipExpiredAt = formattedDate(renewDate);
        title = translations['MEMBERSHIPRENEWED'];
        body = translations['MEMBERSHIPRENEWEDINFO'];
      } else {
        user.renewMembership = false;
        user.membership = 1;
        title = translations['NOTENOUGHRENEWCOINS'];
        body = translations['NOTENOUGHRENEWCOINSINFO'];
      }
    }

    if (user._deviceIds) {
      for (let deviceId of user._deviceIds) {
        messages.push({
          token: deviceId,
          data: {
            type: 'EXPIREDMEMBERSHIP'
          },
          notification: {
            title: title,
            body: body
          }
        });
      }
    }

    admin.firestore().collection('Users').doc(user.id).set(user);
  });

  if (messages.length > 0) {
    admin.messaging().sendEach(messages);
  }

  res.send(false);
});

exports.addCategories = onRequest(async (req, res) => {
  const categories = [
    {
      genders: [1, 2, 3],
      value: 'BDSM'
    },
    {
      genders: [1, 2, 3],
      value: 'ESCORT'
    },
    {
      genders: [2, 3],
      value: 'COLLEGEGIRL'
    },
    {
      genders: [1, 3],
      value: 'COLLEGEBOY'
    },
    {
      genders: [1, 2, 3],
      value: 'DANCER'
    },
    {
      genders: [2, 3],
      value: 'GYMGIRL'
    },
    {
      genders: [1, 3],
      value: 'GYMBOY'
    },
    {
      genders: [1, 2, 3],
      value: 'MASSAGE'
    },
    {
      genders: [2, 3],
      value: 'MATURE'
    },
    {
      genders: [2, 3],
      value: 'MEGABOOBS'
    },
    {
      genders: [2, 3],
      value: 'MILF'
    },
    {
      genders: [2, 3],
      value: 'PETITE'
    },
    {
      genders: [2, 3],
      value: 'SUGARBABE'
    },
    {
      genders: [2, 3],
      value: 'SUPERBOOTY'
    },
    {
      genders: [2, 3],
      value: 'SUPERSTAR'
    },
    {
      genders: [1, 3],
      value: 'SUGARDADDY'
    }
  ];

  for (let i = 0; i < categories.length; i++) {
    let category = categories[i];
    category.key = i + 1;

    await admin.firestore().collection('UserCategories').add(category);
  }

  res.send(true);
});


exports.listener = require('./src/listener');
