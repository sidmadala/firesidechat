import React from 'react';
import './App.css';

import {SignIn, SignOut} from "components/Authentication.js";

// importing firebase sdk modules
import firebase from 'firebase/app';

const auth = firebase.auth();


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

export default ChatMessage;