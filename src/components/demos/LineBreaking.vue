<template>
  <div class='line-breaking-demo'>
    <label>
      Paragraph width:
      <input type="range" v-model="paragraphWidth" min="10" max="60" value="20" @change="doKnuth"> em
    </label>
    <label>
      Justify? <input type="checkbox" v-model="justify">
    </label>
    <h4>Original:</h4>
    <p class='original' :class="{ justified: justify }" :style="{maxWidth: paragraphWidth + 'em'}">
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
    
    <h4>Knuth’d:</h4>
    <p :class="{ output: true, justified: justify }" :style="{maxWidth: paragraphWidth + 'em'}"></p>
  </div>
</template>

<script>

import { layoutItemsFromString, breakLines /*, positionItems */ } from 'tex-linebreak';

export default {
  name: "LineBreaking",
  data: () => ({
    ruler: null,
    outputHTML: "",
    paragraphWidth: 20,
    justify: false,
  }),
  computed: {
    originalParagraph: function() {
      return this.$el.querySelector('p.original');
    },
    outputParagraph: function() {
      return this.$el.querySelector('p.output');
    },
  },
  methods: {
    doKnuth() {
      //"this" will be the vue object
      const items = layoutItemsFromString(this.originalParagraph.textContent, this.measureText);
      const breakpoints = breakLines(items, this.originalParagraph.getBoundingClientRect().width);
    
      let lines = [];
      for (let i=0, l=breakpoints.length-1; i < l; i++) {
        lines.push(items.slice(breakpoints[i], breakpoints[i+1]).map(item => item.text ?? "").join("").trim());
      }
      
      this.outputParagraph.innerHTML = "<div>" + lines.join("</div><div>") + "</div>";
      
      const fullWidth = this.outputParagraph.clientWidth;
      for (let line of this.outputParagraph.childNodes) {
        const actualWidth = this.measureText(line.textContent);
        const words = line.textContent.trim().split(/[\s-]+/);
        if (words.length > 1) {
          const wordSpace = (fullWidth - actualWidth) / (words.length - 1);
          line.style.wordSpacing = wordSpace + 'px';
        }
      }
    },
    measureText(text) {
      if (text === " ") {
        return this.measureText("H H") - this.measureText("HH");
      }
      this.ruler.textContent = text;
      const result = this.ruler.getBoundingClientRect().width;
      this.ruler.textContent = "";
      return result;
    },
  },
  mounted: function() {
    this.ruler = document.createElement('span');
    this.ruler.style.position = "absolute";
    this.ruler.style.visibility = "hidden";
    this.ruler.style.whiteSpace = "nowrap";
    this.originalParagraph.appendChild(this.ruler);
    
    this.doKnuth();
    window.addEventListener('resize', this.doKnuth);
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.doKnuth);
  }
};

</script>

<style lang="scss">
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
  
  p.output {
    white-space: nowrap;
  }
  
  p.output:not(.justified) > * {
    word-spacing: 0 !important;
  }
  
  p.output.justified > :last-child {
    word-spacing: 0 !important;
  }
}

</style>
