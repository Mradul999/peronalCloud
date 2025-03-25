/* eslint-disable no-undef */
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
// import dotenv from "dotenv";
// dotenv.config();
// console.log("key", import.meta.env.VITE_FIREBASE_API_KEY);

// Configure Firebase with retry on network failure
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase with custom settings
const app = firebase.initializeApp(firebaseConfig);

// Configure auth persistence
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Get auth instance
export const auth = app.auth();

// Configure Firestore with offline persistence
const firestore = app.firestore();
firestore.enablePersistence({ synchronizeTabs: true })
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab
      console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // Current browser doesn't support persistence
      console.warn('Firestore persistence not supported in this browser');
    }
  });

export const db = {
  folders: firestore.collection("folders"),
  files: firestore.collection("files"),
  formatDoc: (doc) => {
    return { id: doc.id, ...doc.data() };
  },
  getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp,
};

export const storage = app.storage();

export default app;
