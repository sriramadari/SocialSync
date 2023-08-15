// import dotenv from 'dotenv';
// dotenv.config();
import { initializeApp } from "firebase/app";
import { getAuth} from 'firebase/auth';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCQprK9dmzDIZMeJIWcZT0sm-aY5lLcjj8",
  authDomain: "socialsync-248de.firebaseapp.com",
  databaseURL: "https://socialsync-248de-default-rtdb.firebaseio.com",
  projectId: "socialsync-248de",
  storageBucket: "socialsync-248de.appspot.com",
  messagingSenderId: "1012696874860",
  appId: "1:1012696874860:web:8a1ff9d8de6389cae2bd49",
  measurementId: "G-F6M3K4D9N9"
 
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth=getAuth(app);
export {app,auth,db};
