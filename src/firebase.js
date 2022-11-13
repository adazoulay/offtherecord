import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMm2_NGVgxAO4H3-aLwNMoylr6kr0QyIY",
  authDomain: "offtherecord-01.firebaseapp.com",
  projectId: "offtherecord-01",
  storageBucket: "offtherecord-01.appspot.com",
  messagingSenderId: "334348852467",
  appId: "1:334348852467:web:7d4b13d373a9f55ef46b86",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
