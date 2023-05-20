import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
  
const firebaseConfig = {
  apiKey: "AIzaSyB9Sv825Pw4k9ZmcN7f7rD-EAnoXOUJMEs",
  authDomain: "tepslms.firebaseapp.com",
  databaseURL: "https://tepslms-default-rtdb.firebaseio.com",
  projectId: "tepslms",
  storageBucket: "tepslms.appspot.com",
  messagingSenderId: "590983169226",
  appId: "1:590983169226:web:1a109046d3ae3cb9162033",
  measurementId: "G-QH76YH01FK"
};
  
firebase.initializeApp(firebaseConfig); 
export const db = firebase.firestore();
export const auth = firebase.auth();

