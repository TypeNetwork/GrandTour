<style lang="scss">
  .headline-fitting-demo {
    h1 {
      font-family: AmstelvarRoman, "Comic Sans MS";
      border: 1px solid #FCC;
      white-space: nowrap;
      &::after {
        content: attr("style");
      }
    }
  }
</style>

<template>
  <div class='headline-fitting-demo'>
    <portal to="control-panel">
      <form id='headline-fitting-controls'>
        <h4>Headline</h4>
        <label>
          Width
          <b-slider v-model="width" :min="10" :max="60" :step="0.1" :tooltip="false" @input="setHeight" @change="setHeight"/>
        </label>
        <label>Height <b-slider :min="18" max:="72" v-model="height" @input="setHeight" @change="setHeight"/></label>
      </form>
    </portal>
    <h1 ref="h1" :style="h1Style">
      <slot>Headline Fitting</slot>
    </h1>
  </div>
</template>

<script src="./HeadlineFitting.js"/>

