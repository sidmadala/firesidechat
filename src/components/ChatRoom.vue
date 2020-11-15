<template>
  <main class="section">
    <h3>Welcome to ChatRoom: {{ chatId }}</h3>

    <router-link to="/">Back</router-link>

    <p>
    Open this link in another browser window to chat 
      <code>https://fireside-b0dbe.web.app/#/chats/{{ chatId }}</code>
    </p>

    <User #user="{ user }">
      <div v-if="user">
        <ul>
          <li v-for="message of messages" :key="message.id">
            <ChatMessage :message="message" :owner="user.uid === message.sender" />
          </li>
        </ul>

        <hr />
        <h5>Record Audio</h5>

        <button v-if="!recorder" @click="record()" class="button is-info">Record Voice</button>
        <button v-else @click="stop()" class="button is-danger">Stop</button>

        <br />

        <audio v-if="newAudio" :src="newAudioURL" controls></audio>

        <hr />

        <input v-model="newMessageText" class="input" />

        <button
          :disabled="(!newMessageText && !newAudio) || loading"
          class="button is-success"
          type="text"
          @click="addMessage(user.uid, user.email)"
        >Send</button>
      </div>

      <Login v-else />
    </User>
  </main>
</template>

<script>

import User from './User.vue';
import ChatMessage from './ChatMessage.vue';
import Login from './Login.vue';
import { db, storage } from '../firebase';

export default {
  components: {
    User,
    Login,
    ChatMessage,
  },
  data() {
      return {
          newMessageText: '',
          loading: false,
          messages: [],
          newAudio: null,
          recorder: null,
      }
  },
  computed: {
    // getting chat id path for routing with computed property
    chatId() {
      return this.$route.params.id;
    },
    // getting messages within chat uid with computed property
    messagesCollection() {
      return db.doc(`chats/${this.chatId}`).collection('messages');
    },
    // making new URL to store audio
    newAudioURL() {
      return URL.createObjectURL(this.newAudio);
    }
  },
	//getting last 25 messages in chat to display
  firestore() {
    return {
      messages: this.messagesCollection.orderBy('createdAt').limitToLast(25)
    };
  },
  methods: {

    // asynchronous write to firebase to add message with text and UID
    async addMessage(uid, email) {

        this.loading = true;

        let audioURL = null;

        // generate random id without creating the document itself
        const { id: messageId } = this.messagesCollection.doc();
		
        // conditional to add audio file to firestore
        if (this.newAudio) {
          const storageRef = storage
            .ref('chats')
            .child(this.chatId)
            .child(`${messageId}.wav`);  // formatting audio as wav in chat id

            await storageRef.put(this.newAudio);
          // wait to receive audio URL before continuing
          audioURL = await storageRef.getDownloadURL();
        }

        // overwrite existing information at message id (create new doc)	
        await this.messagesCollection.doc(messageId).set({
            text: this.newMessageText,
            sender: uid,
            email: email,
            createdAt: Date.now(),
            audioURL
        });

        this.loading = false;
        this.newMessageText = '';
        this.newAudio = null;
    },

    // record audio from browser
    async record() {
      this.newAudio = null;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });

      const options = { mimeType: "audio/webm" };
      const recordedChunks = [];
      this.recorder = new MediaRecorder(stream, options);

      this.recorder.addEventListener("dataavailable", e => {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      });

      this.recorder.addEventListener("stop", () => {
        this.newAudio = new Blob(recordedChunks);
        console.log(this.newAudio);
      });

      this.recorder.start();
    },

    // asynchronous call to stop recording audio
    async stop() {
      this.recorder.stop();
      this.recorder = null;
    }
  }
};
</script>


<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-width: 500px;
  background: #efefef;
  padding: 10px;
  border-radius: 0;
}

li {
  display: flex;
}
</style>
