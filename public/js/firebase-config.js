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
  apiKey: "AIzaSyBayrQoj94vJeOqIeWwa0YK-cfie1kGsdQ",
  authDomain: "enrollmentpro-e30fd.firebaseapp.com",
  projectId: "enrollmentpro-e30fd",
  storageBucket: "enrollmentpro-e30fd.firebasestorage.app",
  messagingSenderId: "465102462265",
  appId: "1:465102462265:web:7e73d947065e0095255ce8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
