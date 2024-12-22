// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyAzcGVzPdhsAgmOIeSaaZy7hpBfesm6Igs",
    authDomain: "weather-station-2bcc4.firebaseapp.com",
    databaseURL: "https://weather-station-2bcc4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "weather-station-2bcc4",
    storageBucket: "weather-station-2bcc4.firebasestorage.app",
    messagingSenderId: "693575168908",
    appId: "1:693575168908:web:0707c56a0e733159b81ca9",
    measurementId: "G-0EQPDMQ3GP"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export default database;
export { auth };
