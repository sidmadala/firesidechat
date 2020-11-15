<template>
  <div>
    <slot name="user" :user="user"></slot>
  </div>
</template>

<script>
import { auth } from '../firebase';
import { ref } from '@vue/composition-api';

export default {

  // webhook to create user reference
  setup() {

    const user = ref(null);
    const unsubscribe = auth.onAuthStateChanged(firebaseUser =>  user.value = firebaseUser);
    return {
      user,
      unsubscribe,
    }
  },
	
  // webhook to remove user reference to prevent memory leaks
  destroyed() {
    this.unsubscribe()
  }
}
</script>
