
export default {
  state: {
    //any conceivable property that affects text measurement
    fontProperties: ['font-size', 'font-family', 'font-style', 'font-weight', 'font-stretch', 'font-variant', 'font-feature-settings', 'text-transform', 'text-rendering', 'letter-spacing', 'word-spacing', 'font-variation-settings'],
    rulerBase: null,
    ruler: null
  },
  getters: {
    measureTextWidth: (state, getters) => (text, extraStyles) => {
      if (text === " ") {
        return getters.measureTextWidth("H H", extraStyles) - getters.measureTextWidth("HH", extraStyles);
      }
      
      state.ruler.textContent = text;
      state.ruler.style.cssText = '';

      if (typeof extraStyles === 'object') {
        Object.keys(extraStyles).forEach(k => {
          state.ruler.style[k] = extraStyles[k];
        });
      } else if (typeof extraStyles === "string") {
        state.ruler.style.cssText = extraStyles;
      }

      const result = state.ruler.getBoundingClientRect().width;
      return result;
    },
    fitAxisToWidth: (state, getters) => (payload) => {
  
      //bounces around on an axis until a given width is filled by the text
      // this assumes the ruler has already been configured setRulerStyles
  
      if (!payload.font || !payload.axis || !payload.text || !payload.font.axes || !payload.font.axes[payload.axis]) {
        throw "axisToWidth missing required argument: text, axis, font.axes[axis]";
      }
  
      var measuredWidths = {};
      var xtraMeasure = xtry => {
        if (!(xtry in measuredWidths)) {
          measuredWidths[xtry] = getters.measureTextWidth(payload.text, {fontVariationSettings: `"${payload.axis}" ${xtry}`});
        }
        return measuredWidths[xtry];
      };
  
      var xmin = payload.font.axes[payload.axis].min,
        xmax = payload.font.axes[payload.axis].max,
        xtra = Math.max(xmin, Math.min(xmax, payload.font.axes[payload.axis].default));
        
      var minWidth = xtraMeasure(xmin), currentWidth = xtraMeasure(xtra), maxWidth = xtraMeasure(xmax);
      const fudge = 2;
      var tries = 10;
      while (--tries) {
        if (Math.abs(currentWidth - payload.width) <= fudge) {
          break;
        }
        if (maxWidth <= payload.width-fudge) {
          xtra = xmax;
          break;
        }
        if (minWidth >= payload.width+fudge) {
          xtra = xmin;
          break;
        }
        
        if (currentWidth > payload.width) {
          xmax = xtra;
          maxWidth = currentWidth;
        } else {
          xmin = xtra;
          minWidth = currentWidth;
        }
        xtra = (xmax + xmin) / 2;
        currentWidth = xtraMeasure(xtra);
      }
      
      return xtra;
    },
  },
  mutations: {
    createRuler(state, ruler) {
      state.rulerBase = ruler;
      state.rulerBase.innerHTML = "<span></span>";
      state.ruler = state.rulerBase.childNodes[0];
    },
    setRulerStyles(state, styleOrElement) {
      state.ruler.style.cssText = "";

      let styles = {};
      if (styleOrElement instanceof HTMLElement) {
        styles = getComputedStyle(styleOrElement);
      } else {
        styles = styleOrElement;
      }
      
      if (typeof styles === 'object') {
        state.fontProperties.forEach(prop => {
          if (prop in styles) {
            state.rulerBase.style[prop] = styles[prop];
          }
        });
      } else if (typeof styles === "string") {
        state.rulerBase.style.cssText = styles;
      }
    },
  },
  actions: {
/*
    exampleRulerAction: (context, payload) => {
    },
*/
  }
}

