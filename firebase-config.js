// Firebase Configuration
// Replace these values with your Firebase project config
// Get them from: Firebase Console > Project Settings > General > Your apps

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let db;
let storage;
try {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    storage = firebase.storage();
    
    // Enable offline persistence
    db.enablePersistence().catch((err) => {
      if (err.code == 'failed-precondition') {
        console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code == 'unimplemented') {
        console.log('The current browser does not support persistence.');
      }
    });
  } else {
    console.error('Firebase SDK not loaded. Please check your Firebase script tags.');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

