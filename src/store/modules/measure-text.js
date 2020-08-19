
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

