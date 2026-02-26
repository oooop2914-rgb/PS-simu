import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAuLhUy2lzLGi5ywMnqoYHro8r0fqlWljs",
  authDomain: "database-ps-ecf2b.firebaseapp.com",
  projectId: "database-ps-ecf2b",
  storageBucket: "database-ps-ecf2b.firebasestorage.app",
  messagingSenderId: "731826136011",
  appId: "1:731826136011:web:dcd306cc5727a727d60c4e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
