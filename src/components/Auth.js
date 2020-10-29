import React from 'react';

// importing firebase sdk modules
import firebase from 'firebase/app';

const auth = firebase.auth();

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

export default SignIn; 