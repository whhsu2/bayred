const firebaseConfig = {
  apiKey: "AIzaSyCdcSiqmWAObrPeEPEH3DKSXrLgU3aCvdc",
  authDomain: "homeluten.firebaseapp.com",
  projectId: "homeluten",
  storageBucket: "homeluten.appspot.com",
  messagingSenderId: "747892654311",
  appId: "1:747892654311:web:f1570c8a8aae15e424e242",
  measurementId: "G-RMB1TE7SXZ"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

var remoteConfig = firebase.remoteConfig();

// remote config, default to 3600000 ms = 1 hour
remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
remoteConfig.defaultConfig = {
  "review_promo": false,
  "review_promo_free_days": 14,
  "first_impression_url": "https://www.redfin.com/CA/San-Bruno/670-San-Bruno-Ave-E-94066/home/171889082",
  "limited_time_free_access": '{}'
};
remoteConfig.fetchAndActivate();
