<template>
  <div id="control-panel">
    <portal-target name="control-panel">
    </portal-target>
  </div>
</template>

<script>
export default {
  name: "ControlPanel",
  computed: {
    controls() {
      return this.$store.state.controlPanel.controls;
    }
  }
};
</script>

<style lang="scss">

#control-panel {
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 1rem;
  border-radius: 0.5em;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  
  label {
    display: block;
  }
}

</style>
