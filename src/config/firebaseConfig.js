// firebaseConfig.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth} from 'firebase/auth';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyC0djxRtvn1BWGeiWw-nq181erZagWBSFU",
  authDomain: "admin-dashboard-1a21a.firebaseapp.com",
  projectId: "admin-dashboard-1a21a",
  storageBucket: "admin-dashboard-1a21a.firebasestorage.app",
  messagingSenderId: "777516939275",
  appId: "1:777516939275:web:78fb61c721e5dbddaaaf0e",
  measurementId: "G-G2FWXJRN7F"
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Export Firebase services for use in other files
export { db, auth, storage };
