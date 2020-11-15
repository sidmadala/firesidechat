<template>
  <div id="app">
    <header>
      <h1>Fireside Chat 🔥</h1>
      <p>Text and voice chat in the browser</p>
    </header>

    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {

  }
}
</script>

<style>
header {
  text-align: center;
}
button, input {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
