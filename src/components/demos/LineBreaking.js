import { layoutItemsFromString, breakLines /*, positionItems */ } from 'tex-linebreak';

export default {
  name: "LineBreaking",
  data: () => ({
    axes: {},
    finalLines: [],
    paragraphWidth: 20,
    doKnuth: true,
    doWordspace: true,
    doXTRA: true,
  }),
  computed: {
    paragraphStyle: function() {
      return {
        maxWidth: `${this.paragraphWidth}em`,
      };
    }
  },
  methods: {
    measureText(text, style) {
      if (text === " ") {
        return this.measureText("H H", style) - this.measureText("HH", style);
      }
      this.$refs.ruler.textContent = text;
      this.$refs.ruler.style.cssText = '';
      if (typeof style === 'object') {
        Object.keys(style).forEach(k => {
          this.$refs.ruler.style[k] = style[k];
        });
      } else if (typeof style === 'string') {
        this.$refs.ruler.style.cssText = style;
      }
      const result = this.$refs.ruler.getBoundingClientRect().width;
      return result;
    },
    getKnuthLines(fullText, lineWidth) {
      const items = layoutItemsFromString(fullText, this.measureText);
      const breakpoints = breakLines(items, lineWidth);
    
      let lines = [];
      for (let i=0, l=breakpoints.length-1; i < l; i++) {
        lines.push(items.slice(breakpoints[i], breakpoints[i+1]).map(item => item.text ?? "").join("").trim());
      }
      return lines;
    },
    breakLines(fullText, lineWidth) {
      if (this.doKnuth) {
        return this.getKnuthLines(fullText, lineWidth);
      } else {
        var lines = [];
        var currentLine = "";
        fullText.trim().split(/\s+/).forEach(word => {
          const oneMore = currentLine + (currentLine.length ? " " : "") + word;
          const currentWidth = this.measureText(oneMore);
          if (currentWidth > lineWidth) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = oneMore;
          }
        });
        if (currentLine) {
          lines.push(currentLine);
        }
        return lines;
      }
    },
    justify() {
      this.$store.dispatch('elementFont', this.$refs.output).then(font => {
        const lineWidth = this.$refs.output.clientWidth;
        let knuthLineWidth = lineWidth;

        const doXTRA = this.doXTRA && font.axes && font.axes.XTRA;

        if (doXTRA) {
          //we're going to do some fudging here. If the XTRA default is in the middle of a range,
          // we want to break lines to a slightly wider paragraph so that the font can go
          // narrower as well as wider. So first we measure the width range 
  
          let widths = [];
          for (let xtra of [font.axes.XTRA.min, font.axes.XTRA.default, font.axes.XTRA.max]) {
            widths.push(this.measureText("How wide is this string?", {fontVariationSettings: '"XTRA" ' + xtra}));
          }
  
          let lineFudge = 1;
          if (widths[0] > 0 && widths[0] < widths[1]) {
            lineFudge = 1 + (widths[1] / widths[0] - 1) * 0.1;
          }
          
          knuthLineWidth = lineWidth * lineFudge;
        }

        const textLines = this.breakLines(this.$refs.originalText.textContent, knuthLineWidth);
        
        let finalLines = [];
        var lineCount = textLines.length;
        textLines.forEach((text, i) => {
          let line = {
            text: text,
            style: {}
          };

          const isLastLine = i === lineCount-1;
  
          if (doXTRA) {
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
            if (isLastLine && xtra > font.axes.XTRA.default) {
              xtra = font.axes.XTRA.default;
            }
  
            line.style.fontVariationSettings = '"XTRA" ' + xtra;
            line.xtra = xtra;
          } //doXTRA

          if (this.doWordspace && !isLastLine) {
            const actualWidth = this.measureText(text, line.style);
            const words = text.trim().split(/\s+/);
            if (words.length > 1) {
              const wordSpace = (lineWidth - actualWidth) / (words.length - 1);
              if (this.justify || wordSpace < 0) {
                line.style.wordSpacing = wordSpace + 'px';
              }
            }
          }
  
          finalLines.push(line);
        });
        
        this.finalLines = finalLines;
      }).catch(err => {
        console.log(err);
      });
    },
  },
  mounted: function() {
    this.justify();
    window.addEventListener('resize', this.justify);
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.justify);
  }
};
