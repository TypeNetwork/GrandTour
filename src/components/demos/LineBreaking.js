import { layoutItemsFromString, breakLines /*, positionItems */ } from 'tex-linebreak';

export default {
  name: "LineBreaking",
  data: () => ({
    ruler: null,
    knuthLines: [],
    paragraphWidth: 20,
    justify: false,
  }),
  computed: {
  },
  methods: {
    doKnuth() {
      //"this" will be the vue object
      const lineWidth = this.$refs.originalParagraph.clientWidth;
      const items = layoutItemsFromString(this.$refs.originalParagraph.textContent, this.measureText);
      const breakpoints = breakLines(items, lineWidth);
    
      let lines = [];
      for (let i=0, l=breakpoints.length-1; i < l; i++) {
        lines.push(items.slice(breakpoints[i], breakpoints[i+1]).map(item => item.text ?? "").join("").trim());
      }
      
      var knuthLines = [];
      
      for (let text of lines) {
        let line = {
          text,
          style: {},
        };

        const actualWidth = this.measureText(text);
        const words = text.trim().split(/\s+/);
        if (words.length > 1) {
          const wordSpace = (lineWidth - actualWidth) / (words.length - 1);
          if (this.justify || wordSpace < 0) {
            line.style.wordSpacing = wordSpace + 'px';
          }
        }
        knuthLines.push(line);
      }
      
      if (knuthLines.length > 0) {
        knuthLines[knuthLines.length-1].style.wordSpacing = "";
      }
      
      this.knuthLines = knuthLines;
      this.xtraLines = knuthLines;
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
    this.$refs.originalParagraph.appendChild(this.ruler);
    
    this.doKnuth();
    window.addEventListener('resize', this.doKnuth);
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.doKnuth);
  }
};
