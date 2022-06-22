import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAG_EBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

initializeApp(firebaseConfig);
export const authService = getAuth();
export const dbService = getFirestore();
export const storageService = getStorage();
