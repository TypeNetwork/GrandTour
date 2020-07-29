<template>
  <div id="grand-tour">
    <ControlPanel />
    <MasterLayout />
  </div>
</template>

<script>
import ControlPanel from "./components/ControlPanel.vue";
import MasterLayout from "./components/MasterLayout.vue";

export default {
  name: "GrandTour",
  components: {
    ControlPanel,
    MasterLayout,
  }
};
</script>

<style lang="scss">

@font-face {
  font-family: "Amstelvar";
  src: url("./assets/fonts/Amstelvar-Roman-VF.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
}

@font-face {
  font-family: "Amstelvar";
  src: url("./assets/fonts/Amstelvar-Italic-VF.woff2") format("woff2");
  font-weight: 100 900;
  font-style: italic;
}

#grand-tour {
  font-family: system-ui, sans-serif;
}
</style>
