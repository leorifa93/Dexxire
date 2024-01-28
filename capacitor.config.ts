import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.digiminds.dexxire',
  appName: 'Dexxire',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
    "GoogleAuth": {
      "scopes": ['profile', 'email'],
      "serverClientId": "750696506520-uoj9srloh4um5s47tk7s5qa4hfgkn5b6.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true
    }
  }
};

export default config;
