import { layoutItemsFromString, breakLines /*, positionItems */ } from 'tex-linebreak';

export default {
  name: "LineBreaking",
  data: () => ({
    axes: {},
    ruler: null,
    knuthLines: [],
    xtraLines: [],
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
    },
    doXtra() {
      const font = this.$getElementFont(this.$refs.xtraParagraph);
      if (typeof font !== "object") {
        console.log("Font not loaded");
        setTimeout(this.doXtra, 500);
        return;
      }
      if (!font.axes || !font.axes.XTRA) {
        this.xtraLines = this.knuthLines;
        return;
      }
      
      let xtraLines = [];
      const lineWidth = this.$refs.originalParagraph.clientWidth;
      this.knuthLines.forEach(knuthLine => {
        const text = knuthLine.text;
        let line = {
          text: text,
          style: {}
        };

        var measuredWidths = {};
        var xtraMeasure = xtry => {
          if (!(xtry in measuredWidths)) {
            measuredWidths[xtry] = this.measureText(text, {fontVariationSettings: '"XTRA" ' + xtry});
          }
          return measuredWidths[xtry];
        };

        var xtra = font.axes.XTRA.default, xmin = font.axes.XTRA.min, xmax = font.axes.XTRA.max;
        var minWidth = xtraMeasure(xmin), currentWidth = xtraMeasure(xtra), maxWidth = xtraMeasure(xmax);
        const fudge = 2;
        var tries = 10;
        while (--tries) {
          if (Math.abs(currentWidth - lineWidth) <= fudge) {
            break;
          }
          if (maxWidth < lineWidth) {
            xtra = xmax;
            break;
          }
          if (minWidth > lineWidth) {
            xtra = xmin;
            break;
          }
          
          if (currentWidth > lineWidth) {
            xmax = xtra;
            maxWidth = currentWidth;
          } else {
            xmin = xtra;
            minWidth = currentWidth;
          }
          xtra = (xmax + xmin) / 2;
          currentWidth = xtraMeasure(xtra);
        }

        line.style.fontVariationSettings = '"XTRA" ' + xtra;
        line.xtra = xtra;

        xtraLines.push(line);
      });
      
      this.xtraLines = xtraLines;
    },
    doAll() {
      this.doKnuth();
      this.doXtra();
    },
    measureText(text, style) {
      if (text === " ") {
        return this.measureText("H H", style) - this.measureText("HH", style);
      }
      this.ruler.textContent = text;
      this.ruler.style.cssText = '';
      if (typeof style === 'object') {
        Object.keys(style).forEach(k => {
          this.ruler.style[k] = style[k];
        });
      } else if (typeof style === 'string') {
        this.ruler.style.cssText = style;
      }
      const result = this.ruler.getBoundingClientRect().width;
      this.ruler.textContent = "";
      return result;
    },
  },
  mounted: function() {
    this.ruler = document.createElement('span');
    this.ruler.id = 'knuth-width-ruler';
    this.$refs.originalParagraph.appendChild(this.ruler);
    
    this.doAll();
    window.addEventListener('resize', this.doAll);
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.doAll);
  }
};
