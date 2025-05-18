
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, type Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACujPaNi-ij3CzbpqL0K868DVpRUgqXUc",
  authDomain: "furni-price.firebaseapp.com",
  projectId: "furni-price",
  storageBucket: "furni-price.firebasestorage.app",
  messagingSenderId: "731262831671",
  appId: "1:731262831671:web:08d327cd016b68a47a43b2",
  measurementId: "G-K0GXQ23F0N"
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics | null = null; // Initialize analytics as null

if (typeof window !== 'undefined') { // Ensure Firebase is initialized only on the client-side
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
  } else {
    app = getApps()[0];
    // Check if analytics is already initialized for this app instance
    // This is a bit of a workaround as getAnalytics ideally should be called once.
    // A more robust solution might involve a global state or context if analytics needs to be re-accessed.
    try {
      analytics = getAnalytics(app);
    } catch (e) {
      console.warn("Firebase Analytics might already be initialized or cannot be re-initialized here.");
    }
  }
} else {
  // Handle server-side rendering or environment where window is not defined
  // Initialize app for server-side operations if needed, but analytics won't work.
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
}


const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db, analytics };
