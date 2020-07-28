<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <GrandTour msg="Type Network Grand Tour" />
  </div>
</template>

<script>
import GrandTour from "./components/GrandTour.vue";

export default {
  name: "Grand Tour",
  components: {
    GrandTour
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
