// Firebase Configuration
// Replace these values with your Firebase project config
// Get them from: Firebase Console > Project Settings > General > Your apps

const firebaseConfig = {
  apiKey: "AIzaSyBHTdpLxPSwL1jfE17C5XokffgOGBLsXj4",
  authDomain: "xeltrix-sales-app.firebaseapp.com",
  projectId: "xeltrix-sales-app",
  storageBucket: "xeltrix-sales-app.appspot.com", // ✅ FIXED
  messagingSenderId: "687444776584",
  appId: "1:687444776584:web:e022e44840e22fe74eb13d",
  measurementId: "G-SH07BK2VMD"
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

