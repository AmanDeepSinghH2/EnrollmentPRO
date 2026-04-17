// =====================================================================
// EnrollmentPRO — Firebase Configuration
// =====================================================================
// IMPORTANT: Replace the config below with your actual Firebase project keys.
// Get them from: Firebase Console → Project Settings → Web App → Config
// =====================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyReplace",
  authDomain: "enrollmentpro-srmist.firebaseapp.com",
  projectId: "enrollmentpro-srmist",
  storageBucket: "enrollmentpro-srmist.firebasestorage.app",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:abc123replace"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
