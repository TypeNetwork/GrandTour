import { layoutItemsFromString, breakLines /*, positionItems */ } from 'tex-linebreak';

export default {
  name: "LineBreaking",
  data: () => ({
    axes: {},
    ruler: null,
    knuthLines: [],
    xtraLines: [],
    paragraphWidth: 20,
    justify: true,
  }),
  computed: {
  },
  methods: {
    getKnuthLines(fullText, lineWidth) {
      const items = layoutItemsFromString(fullText, this.measureText);
      const breakpoints = breakLines(items, lineWidth);
    
      let lines = [];
      for (let i=0, l=breakpoints.length-1; i < l; i++) {
        lines.push(items.slice(breakpoints[i], breakpoints[i+1]).map(item => item.text ?? "").join("").trim());
      }
      return lines;
    },
    doKnuth() {
      const lineWidth = this.$refs.originalParagraph.clientWidth;
      const textLines = this.getKnuthLines(this.$refs.originalParagraph.textContent, lineWidth);
      
      var knuthLines = [];
      
      for (let text of textLines) {
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
      this.$store.dispatch('elementFont', this.$refs.xtraParagraph).then(font => {
        if (!font.axes || !font.axes.XTRA) {
          throw font.cssName + ": No XTRA axis";
        }
        
        //we're going to do some fudging here. If the XTRA default is in the middle of a range,
        // we want to break lines to a slightly wider paragraph so that the font can go
        // narrower as well as wider. So first we measure the width range 

        let lineWidth = this.$refs.originalParagraph.clientWidth;

        let widths = [];
        for (let xtra of [font.axes.XTRA.min, font.axes.XTRA.default, font.axes.XTRA.max]) {
          widths.push(this.measureText("How wide is this string?", {fontVariationSettings: '"XTRA" ' + xtra}));
        }

        let lineFudge = 1;
        if (widths[0] > 0 && widths[0] < widths[1]) {
          lineFudge = 1 + (widths[1] / widths[0] - 1) * 0.1;
        }

        const textLines = this.getKnuthLines(this.$refs.originalParagraph.textContent, lineWidth * lineFudge);
        
        let xtraLines = [];
        var lineCount = textLines.length;
        textLines.forEach((text, i) => {
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

          //squeeze last line if necessary, but don't stretch
          if (i === lineCount-1 && xtra > font.axes.XTRA.default) {
            xtra = font.axes.XTRA.default;
          }

          line.style.fontVariationSettings = '"XTRA" ' + xtra;
          line.xtra = xtra;
  
          xtraLines.push(line);
        });
        
        //don't stretch last line
        if (xtraLines.length > 0) {
          xtraLines[xtraLines.length]
        }
        
        this.xtraLines = xtraLines;
      }).catch(err => {
        console.log(err);
        this.xtraLines = this.knuthLines;
      });
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
