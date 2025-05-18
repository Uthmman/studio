
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage"; // Added
import { getAnalytics, type Analytics, isSupported } from "firebase/analytics"; // Added isSupported

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACujPaNi-ij3CzbpqL0K868DVpRUgqXUc",
  authDomain: "furni-price.firebaseapp.com",
  projectId: "furni-price",
  storageBucket: "furni-price.appspot.com", // Ensure this is correct (often .appspot.com)
  messagingSenderId: "731262831671",
  appId: "1:731262831671:web:08d327cd016b68a47a43b2",
  measurementId: "G-K0GXQ23F0N"
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics | null = null;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Analytics only if supported (and on client-side)
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app); // Added

export { app, auth, db, storage, analytics }; // Export storage
