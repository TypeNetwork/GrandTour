<template>
  <div id="master-layout">
    <HeadlineFitting>Headline Fitting</HeadlineFitting>
    <SubheadFitting>Subheads can also be adjusted to fit well into one or more lines</SubheadFitting>
    <LineBreaking>
      Paragraph line-breaking can be a computationally intensive problem.
      Donald Knuth and Michael Plass famously came up with an algorithm in their 1981 paper, 
      <cite>Breaking Paragraphs into Lines</cite>, wherein a paragraph of text is abstracted
      into a series of boxes, glues, and penalties. Bram Stein implemented this algorithm
      <a href="https://github.com/bramstein/typeset">in Javascript</a> way back in 2009,
      but for this project we are using the 
      <a href="https://www.npmjs.com/package/tex-linebreak">tex-linebreak</a> Node package.
      After this, there is not much more to say, so we continue typing here in an effort
      to make the paragraph longer for a better demo. Short paragraphs are notoriously
      ineffective for demonstrating awesome line-breaking algorithms.
    </LineBreaking>
  </div>
</template>

<script>
import HeadlineFitting from "./demos/HeadlineFitting.vue";
import SubheadFitting from "./demos/SubheadFitting.vue";
import LineBreaking from "./demos/LineBreaking.vue";

export default {
  name: "MasterLayout",
  components: {
    HeadlineFitting,
    SubheadFitting,
    LineBreaking,
  },
  props: {
  }
};
</script>

<style scoped lang="scss">
  #master-layout {
    font-family: Amstelvar;
  }
</style>
