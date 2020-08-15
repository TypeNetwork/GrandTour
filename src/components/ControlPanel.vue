<template>
  <div id="control-panel" v-drag="{handle: '#control-panel header'}">
    <header>Control Panel</header>
    <portal-target name="control-panel">
    </portal-target>
  </div>
</template>

<script>
export default {
  name: "ControlPanel",
  methods: {
    
  },
};
</script>

<style lang="scss">

#control-panel {
  position: fixed;
  top: 1rem;
  right: 1rem;
  max-width: max-content !important;
  padding: 1rem;
  border-radius: 0.5em;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  
  header {
    font-size: smaller;
    text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    margin: -1rem -1rem 1rem;
    padding: 0.5rem;
  }
  
  label {
    display: block;
  }
}

</style>
