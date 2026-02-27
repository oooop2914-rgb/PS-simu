import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
 apiKey: "AIzaSyAiRdNk_hd9iTRVyjLx0pu9upNQWHzSQlA",
 authDomain: "ps-simulator-database.firebaseapp.com",
 databaseURL: "https://ps-simulator-database-default-rtdb.asia-southeast1.firebasedatabase.app",
 projectId: "ps-simulator-database",
 storageBucket: "ps-simulator-database.firebasestorage.app",
 messagingSenderId: "331614108947",
 appId: "1:331614108947:web:1ccdfc348124aec951aee6"
};

const app = initializeApp(firebaseConfig)

export const db = getDatabase(app)
export const auth = getAuth(app)
