<template>
  <div>
    <ul>
      <li v-for="chat of chats" :key="chat.id">
        <router-link :to="{ name: 'chat', params: { id: chat.id } }">{{ chat.id }}</router-link>
      </li>
    </ul>

    <button @click="createChatRoom()" class="button">Create New Chat Room</button>
  </div>
</template>

<script>
import { db } from '../firebase';

export default {
	// initializing user chats as empty array to be filled by firebase webhook
  data() {
    return { 
        chats: [] 
    }
  },
	// retrieving user chats based on their UID 
  firestore() {
    return { 
        chats: db.collection('chats').where('owner', '==', this.uid) 
    }
  },
  methods: {
		// add a chatroom with asynchronous write to firebase with user information
      async createChatRoom() {
          const newChat = await db.collection('chats').add({
              createdAt: Date.now(),
              owner: this.uid,
              members: [this.uid]
          })
			// display chat information to console for debugging
            console.log(newChat)
      }


      
  },
  props: ['uid']  // passing UID as property for access in other components

};
</script>
