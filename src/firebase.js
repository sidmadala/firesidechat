// required imports to access firebase features
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

// credentials for firebase access
const firebaseConfig = {
	apiKey: "AIzaSyBCsCSugwJCU3Hlzmo9HdKXW6AF8oOrMnA",
	authDomain: "fireside-b0dbe.firebaseapp.com",
	databaseURL: "https://fireside-b0dbe.firebaseio.com",
	projectId: "fireside-b0dbe",
	storageBucket: "fireside-b0dbe.appspot.com",
	messagingSenderId: "410455411650",
	appId: "1:410455411650:web:adbc4f3689b524bdd9a45b",
	measurementId: "G-72RB2QG1QM"
};

// initializing configuration for firebase access
firebase.initializeApp(firebaseConfig);

// exporting global variables used to access firebase features
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
