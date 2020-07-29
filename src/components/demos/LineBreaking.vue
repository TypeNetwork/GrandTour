<style lang="scss" scoped>
.line-breaking-demo {
  label {
    display: block;
  }
  
  label, input {
    vertical-align: middle;
  }
  
  p {
    max-width: 20em;
    outline: 1px solid #EEF;
  }
  
  p.original.justified {
    text-align: justify;
  }
  
  p.knuth, p.xtra {
    > * {
      white-space: nowrap;
      display: block;
      white-space: nowrap;
      width: max-content;
    }
  }
}
</style>

<template>
  <div class='line-breaking-demo'>
    <label>
      Paragraph width:
      <input type="range" v-model="paragraphWidth" min="10" max="60" value="20" step="0.1" @input="doKnuth"> em
    </label>
    <label>
      Justify? <input type="checkbox" v-model="justify" @change="doKnuth">
    </label>
    <h4>Original:</h4>
    <p ref="originalParagraph" class='original' :class="{ justified: justify }" :style="{maxWidth: paragraphWidth + 'em'}">
      <slot>
        There are many variations of passages of Lorem Ipsum available, 
        but the majority have suffered alteration in some form, by injected humour, 
        or randomised words which don't look even slightly believable. 
        If you are going to use a passage of Lorem Ipsum, you need to be sure there 
        isn't anything embarrassing hidden in the middle of text. 
        All the Lorem Ipsum generators on the Internet tend to repeat predefined 
        chunks as necessary, making this the first true generator on the Internet. 
        It uses a dictionary of over 200 Latin words, combined with a handful of 
        model sentence structures, to generate Lorem Ipsum which looks reasonable. 
        The generated Lorem Ipsum is therefore always free from repetition, 
        injected humour, or non-characteristic words etc.
      </slot>
    </p>
    
    <h4>Knuth + wordspace:</h4>
    <p :class="[ 'knuth', justify ? 'justified' : 'ragged' ]" :style="{maxWidth: paragraphWidth + 'em'}">
      <span v-for="(line, i) in knuthLines" :key="i" :style="line.style">{{line.text}}</span>
    </p>

<!--
    <h4>Knuth + XTRA:</h4>
    <p class="xtra" :style="{maxWidth: paragraphWidth + 'em'}">
      <span v-for="(line, i) in xtraLines" :key="i" :style="line.style">{{line.text}}</span>
    </p>
-->
  </div>
</template>

<script src="./LineBreaking.js"/>

