import React, {useState, useRef} from 'react';
import {ChatMessage} from "./ChatMessage.js";

// importing firebase sdk modules
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// importing firebase webhooks
import {useCollectionData} from 'react-firebase-hooks/firestore';

const auth = firebase.auth();
const firestore = firebase.firestore();

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

export default ChatRoom;