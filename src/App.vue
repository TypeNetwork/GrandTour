<template>
  <div id="grand-tour">
    <component :is="style" v-text="fontFaces"></component>
    <ControlPanel />
    <MasterLayout />
  </div>
</template>

<script src="./App.js"/>

<style lang="scss">
#grand-tour {
  font-family: system-ui, sans-serif;
}
</style>
