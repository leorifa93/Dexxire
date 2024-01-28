// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyBpKAxqfeOhr_VVl0D6olzqPAiLIqv0iP0",
    authDomain: "dexxire-dfcba.firebaseapp.com",
    projectId: "dexxire-dfcba",
    storageBucket: "dexxire-dfcba.appspot.com",
    messagingSenderId: "750696506520",
    appId: "1:750696506520:web:1d95fdb2daa8f61218dced",
    measurementId: "G-KW1GT57JH3"
  },
  googleApiKey: "AIzaSyBxdsntNvOw3i8qUwDC_rqpEDOMvlQJgIQ",
  btcPay: {
    merchant: "HQfdGnXYCrBAbEeDBbBDE1j41xS6bQkrReehycXkPUp1",
    privateKey: "fb2933fe0d763a6fc66a33399e0da057d6bb0bc4f6e71771b2c6cc5d326cb5b1",
    apiKey: "Basic T2hyVU9QMVZRQ2RrYjdNSXBXTUk3R0RMSVZsN0RpTFcxUFA3aXBDcG5pTw==",
    invoiceRedirectUrl: "https://invoicebtcpay-ytbcdg7bga-uc.a.run.app",
    invoiceNotificationUrl: " https://notificationbtcpay-ytbcdg7bga-uc.a.run.app",
    storeId: "3ousmhXcMHCpW48MmB9BFWJWmbiWbJqtvgJzwTcKNnPN"
  },
  algolia: {
    appId: '31Z41D9XBM',
    apiKey: '428f4e96bcad9ab5952c394413f5b2f2'
  },
  sendNotificationUrl: 'https://fcm.googleapis.com/fcm/send',
  notificationServerKey: 'key=AAAArsj_pJg:APA91bGcauytvnY3qEXcVzCXtBoK_abCAxsm03SsiFYj3Gxam-uk7Igqlq5AgDKUug8YP8dwy6nJDK0OHPWJrmexqiLJUVOjTV4wP-bVxI-MMgk00CjXHz3zbJz6Afo6WZg0SUu0pA8k',
  handleEmailVerification: 'http://127.0.0.1:5001/dexxire-dfcba/us-central1/handleEmailVerification',
  fbAppId: '907565230964807',
  googleServiceAccount: '750696506520-uoj9srloh4um5s47tk7s5qa4hfgkn5b6.apps.googleusercontent.com',
  appleClientId: 'com.dexxire.dexxire'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
