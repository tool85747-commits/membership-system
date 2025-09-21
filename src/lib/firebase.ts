import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyB1z8qdCVpJF7nbVPdpsRwujb-IchMFUmg",
  authDomain: "membership-system-f388e.firebaseapp.com",
  projectId: "membership-system-f388e",
  storageBucket: "membership-system-f388e.firebasestorage.app",
  messagingSenderId: "562270483838",
  appId: "1:562270483838:web:840232f52564f150fdaf2f",
  measurementId: "G-WRQYNNCVK7"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const functions = getFunctions(firebaseApp);