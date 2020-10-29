import React, {useState, useRef} from 'react';
// import logo from './logo.svg'; // Get a better logo
import './App.css';

// importing components
// import {ChatRoom} from "components/ChatRoom.js";
// import {SignIn, SignOut} from "components/Auth.js";

// importing firebase sdk modules
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// importing firebase webhooks
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

// firebase configuration
firebase.initializeApp({
  apiKey: "AIzaSyBCsCSugwJCU3Hlzmo9HdKXW6AF8oOrMnA",
  authDomain: "fireside-b0dbe.firebaseapp.com",
  databaseURL: "https://fireside-b0dbe.firebaseio.com",
  projectId: "fireside-b0dbe",
  storageBucket: "fireside-b0dbe.appspot.com",
  messagingSenderId: "410455411650",
  appId: "1:410455411650:web:fe7f067423f899f8d9a45b",
  measurementId: "G-73915MQHEL"
});

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  // Getting user login state
  const [user] = useAuthState(auth);

  // Asking user to sign-in to see chatroom
  return (
    <div className="App">
      <header>
        <h1>Fireside Chat</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  // Creating Google account login provider for firebase
  const signInWithGoogle = () => {
    const GoogleAuthenticationProvider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(GoogleAuthenticationProvider);
  }

  return ( 
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {

  // Checking if user exists to sign out
  // Inline function to sign out of chat room
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

// Main chat room in application
// TODO: Split into multiple chat rooms and add functionality for creating and deleting rooms
function ChatRoom() {

  // const scroller = useRef();  // Creating reference to enable autoscrolling in chat
  const messagesRef = firestore.collection("messages");  // Getting messages collection for current chat room
  const query = messagesRef.orderBy("createdOnTimestamp").limit(100); // TODO: change to be dynamic refresh for infinite scroll
  
  // Querying messages from firebase for display on frontend
  const [messages] = useCollectionData(query, {idField: 'id'});

  // Setting initial state of form 
  const [formValue, setFormValue] = useState('');

  // Writing new messages to firebase database
  const sendMessage = async (event) => {

    // Preventing page refresh on every message submission
    event.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    // Resolve when document is formatted with new message
    await messagesRef.add({
      uid,
      createdOnTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
      text: formValue,
      photoURL
    })

    // Setting message back to empty string
    setFormValue("");

    // scroller.current.scrollIntoView({ behavior: 'smooth' });  // Autoscrolling to bottom of chat
  }

  // Looping over all messages with ChatMessage component to pass message id and contents
  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      {/* <span ref={scroller}></span> */}

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(event) => setFormValue(event.target.value)} placeholder="Message" />

      <button type="submit" disabled={!formValue}>Send</button>

    </form>
  </>)
}

function ChatMessage(props) {
  
  // Extracting message and id from object
  const{ uid, photoURL, text } = props.message;

  // Checking if message was sent or recieved
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  // Returning text body of message
  // Idk why we need tildes in the className but we do
  // Stole the default profile photo from Google Images
  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || "https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg"} />
      <p>{text}</p>
    </div>
  </>)
}

export default App;
