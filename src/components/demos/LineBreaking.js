import { layoutItemsFromString, breakLines, createHyphenator } from 'tex-linebreak';
import enUsPatterns from 'hyphenation.en-us';

const hyphenator = createHyphenator(enUsPatterns);

export default {
  name: "LineBreaking",
  data: () => ({
    font: null,
    axisRanges: {},
    finalLines: [],
    paragraphWidth: 20,
    doKnuth: true,
    doWordspace: true,
    doXTRA: true,
    doHyphenation: true,
  }),
  computed: {
    paragraphStyle: function() {
      return {
        maxWidth: `${this.paragraphWidth}em`,
      };
    }
  },
  methods: {
    getKnuthLines(fullText, lineWidth) {
      const items = layoutItemsFromString(fullText, this.$store.getters.measureTextWidth, this.doHyphenation ? hyphenator : null);
      const breakpoints = breakLines(items, lineWidth);

      window.items = items;
      window.breakpoints = breakpoints;

      let lines = [];
      for (let i=0, l=breakpoints.length-1; i < l; i++) {
        const lineitems = items.slice(breakpoints[i], breakpoints[i+1]);
        const breakpoint = items.length > breakpoints[i+1] ? items[breakpoints[i+1]] : null;
        let line = lineitems.map(item => item.text ?? "").join("").trim();
        if (breakpoint && breakpoint.type === 'penalty' && breakpoint.width && breakpoint.flagged) {
          line += '-';
        }
        lines.push(line);
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
          const currentWidth = this.$store.getters.measureTextWidth(oneMore);
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
      this.$store.commit('setRulerStyles', this.$refs.output);

      const lineWidth = this.$refs.output.clientWidth;
      let knuthLineWidth = lineWidth;

      const doXTRA = this.doXTRA && this.font && this.font.axes && this.font.axes.XTRA;

      if (doXTRA) {
        //we're going to do some fudging here. If the XTRA default is in the middle of a range,
        // we want to break lines to a slightly wider paragraph so that the font can go
        // narrower as well as wider. So first we measure the width range 

        let widths = [];
        for (let xtra of [this.axisRanges.XTRA[0], this.font.axes.XTRA.default, this.axisRanges.XTRA[1]]) {
          widths.push(this.$store.getters.measureTextWidth("How wide is this string?", {fontVariationSettings: '"XTRA" ' + xtra}));
        }

        let lineFudge = 1;
        if (widths[0] > 0 && widths[0] < widths[1]) {
          lineFudge = 1 + (widths[1] / widths[0] - 1) * 0.1;
        }
        
        knuthLineWidth = lineWidth * lineFudge;
      }

      const textLines = this.breakLines(this.$refs.originalText.textContent.trim(), knuthLineWidth);
      
      let finalLines = [];
      var lineCount = textLines.length;
      textLines.forEach((text, i) => {
        let line = {
          text: text,
          style: {}
        };

        const isLastLine = i === lineCount-1;

        if (doXTRA) {
          let xtra = this.$store.getters.fitAxisToWidth({font: this.font, axis: 'XTRA', text, width: lineWidth});
          
          //squeeze last line if necessary, but don't stretch
          const stretchLimit = Math.max(this.axisRanges.XTRA[0], this.font.axes.XTRA.default);
          if (isLastLine && xtra > stretchLimit) {
            xtra = stretchLimit;
          }

          line.style.fontVariationSettings = '"XTRA" ' + xtra;
          line.xtra = xtra;
        } //doXTRA

        if (this.doWordspace && !isLastLine) {
          const actualWidth = this.$store.getters.measureTextWidth(text, line.style);
          const words = text.trim().split(/\s+/);
          if (words.length > 1) {
            const wordSpace = (lineWidth - actualWidth) / (words.length - 1);
            line.style.wordSpacing = wordSpace + 'px';
          }
        }

        finalLines.push(line);
      });
      
      this.finalLines = finalLines;
    },
  },
  mounted: function() {
    this.$store.dispatch('elementFont', this.$refs.output).then(font => {
      this.font = font;
      let axisRanges = {};
      Object.keys(this.font.axes).forEach(axis => {
        axisRanges[axis] = [
          this.font.axes[axis].min,
          this.font.axes[axis].max,
        ];
      });
      this.axisRanges = axisRanges;
      this.justify();
      window.addEventListener('resize', this.justify);
    }).catch(err => {
      console.log(err);
    });
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.justify);
  }
};
