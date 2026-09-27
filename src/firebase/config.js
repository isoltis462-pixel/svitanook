import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB2qAWXjhRsKASf9Urz_j3OtX_ERv9LKGk",
  authDomain: "sonechko-c1d59.firebaseapp.com",
  databaseURL: "https://sonechko-c1d59-default-rtdb.firebaseio.com",
  projectId: "sonechko-c1d59",
  storageBucket: "sonechko-c1d59.firebasestorage.app",
  messagingSenderId: "154000560138",
  appId: "1:154000560138:web:3150ce210a405435b58ff3",
  measurementId: "G-CHBK537FEV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
