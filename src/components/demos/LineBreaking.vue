<style lang="scss">
.line-breaking-demo {
  .ruler {
    position: absolute;
    visibility: hidden;
    white-space: nowrap;
    width: auto !important;
  }
  
  label {
    display: block;
  }
  
  label, input {
    vertical-align: middle;
  }
  
  p {
    font-family: AmstelvarRoman, "Comic Sans MS";
    border: 1px solid #EEF;
  }
  
  p.output {
    position: relative;
    hyphens: none;
    > * {
      white-space: nowrap;
      display: block;
      white-space: nowrap;
      width: 100%;
      overflow: visible;

      &[data-label] {
        position: relative;
        
        &::after {
          font-family: Verdana;
          font-size: 10px;
          display: block;
          position: absolute;
          content: attr(data-label);
          left: calc(100% + 1em);
          bottom: 0.333em;
          color: #69F;
        }
      }
    }
  }
}

#line-breaking-controls {
  label {
    display: grid;
    grid-template-columns: max-content 1fr;
    grid-gap: 1em;
    align-items: center;
    justify-items: start;

    input[type=checkbox] {
      grid-column: 1;
      grid-row: 1;
    }
  }
}
</style>

<template>
  <div class='line-breaking-demo'>
    <portal to="control-panel">
      <form id='line-breaking-controls'>
        <h4>Justification</h4>
        <label>
          Paragraph width
          <b-slider v-model="paragraphWidth" :min="10" :max="60" :step="0.1" @input="justify" @change="justify"/>
        </label>
        <label>
          Hyphenate <input type="checkbox" v-model="doHyphenation" @change="justify">
        </label>
        <label>
          Better line-breaking <input type="checkbox" v-model="doKnuth" @change="justify">
        </label>
        <label>
          Word space <input type="checkbox" v-model="doWordspace" @change="justify">
        </label>
        <label>
          XTRA <input type="checkbox" v-model="doXTRA" @change="justify">
        </label>
        <label v-if="doXTRA && font && font.axes.XTRA">
          XTRA Limits
          <b-slider :min="font.axes.XTRA.min" :max="font.axes.XTRA.max" v-model="axisRanges.XTRA" @input="justify" @change="justify">
            <b-slider-tick :value="font.axes.XTRA.default"/>
          </b-slider>
        </label>
      </form>
    </portal>
    <p ref="originalText" style="display:none">
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
    <p ref="output" class="output" :style="paragraphStyle">
      <span class='ruler' ref="ruler"></span>
      <span v-for="(line, i) in finalLines" :key="i" :style="line.style" :data-label="line.label">{{line.text}}</span>
    </p>
  </div>
</template>

<script src="./LineBreaking.js"/>

