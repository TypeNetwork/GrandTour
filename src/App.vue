<style lang="scss">
#one-to-ruler-them-all {
    position: absolute;
    top: -200vh;
    visibility: hidden;
    white-space: nowrap;
    
    span {
      display: inline;
    }
}

#grand-tour {
  font-family: system-ui, sans-serif;
}
</style>

<template>
  <div id="grand-tour">
    <div id='one-to-ruler-them-all' ref="ruler"><span></span></div>
    <component :is="literallyStyle" v-text="fontFaces"></component>
    <ControlPanel />
    <MasterLayout />
  </div>
</template>

<script src="./App.js"/>

