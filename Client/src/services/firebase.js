import dotenv from 'dotenv';
dotenv.config();
import { initializeApp } from "firebase/app";
import { getAuth} from 'firebase/auth';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.BUCKET,
  messagingSenderId: process.env.MESS_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.M_ID
 
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth=getAuth(app);
export {app,auth,db};
