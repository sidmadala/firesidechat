<template>
  <aside class="section">
    
    <div v-if="newUser">
      <h3>Sign Up for a New Account</h3>
      <a href="#" @click="newUser = false">Returning User?</a>
    </div>

    <div v-else>
      <h3>Sign In with Email</h3>
      <a href="#" @click="newUser = true">New user?</a>
    </div>

    <label for="email">Email</label>
    <br />
    <input v-model="email" placeholder="email" type="email" class="input" />

    <label for="password">Password</label>
    <br />
    <input v-model="password" type="password" class="input" />

    <br />

    <button
      class="button is-info"
      :class="{ 'is-loading': loading }"
      @click="signInOrCreateUser()"
    >{{ newUser ? 'Sign Up' : 'Login'}}</button>

    <p class="has-text-danger" v-if="errorMessage">{{ errorMessage }}</p>
  </aside>
</template>

<script>
import { auth } from '../firebase';


export default {
  data() {
    return {
      auth,
      newUser: false,
      email: '',
      password: '',
      errorMessage: '',
      loading: false
    }
  },

  methods: {
      // asynchronous read/write from/to firebase for user information or creating an account
      async signInOrCreateUser() {
 
        this.loading = true;
        this.errorMessage = '';
        try {
          if (this.newUser) {
            await auth.createUserWithEmailAndPassword(this.email, this.password)
          } else {
            await auth.signInWithEmailAndPassword(this.email, this.password)
          }
        } catch (error) {
            this.errorMessage = error.message;
        }

        this.loading = false;
      }

  },
}

</script>

