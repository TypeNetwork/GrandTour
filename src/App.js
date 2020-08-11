import ControlPanel from "./components/ControlPanel.vue";
import MasterLayout from "./components/MasterLayout.vue";

import "./lib/fontkit/fontkit";
import Vue from "vue";

Vue.prototype.$demoFonts = {
  AmstelvarRoman: {
    url: "fonts/Amstelvar-Roman-VF.woff2",
  },
  AmstelvarItalic: {
    url: "fonts/Amstelvar-Italic-VF.woff2",
  },
};

Vue.prototype.$fontkit = window.fontkit;
Vue.prototype.$fontkit.openURL = function(url, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  var fkFont = null;
  xhr.onload = function () {
    if (this.status == 200) {
      var fkBlob = this.response;
      var fkBuffer = new Buffer(fkBlob);
      fkFont = window.fontkit.create(fkBuffer);
      if (callback) {
        callback(null, fkFont);
      }
    } else if (callback) {
      callback(this.status, null);
    }
  };
  xhr.send();
};

Vue.prototype.$getElementFontFamily = function(el) {
  if (!(el instanceof HTMLElement)) {
    return null;
  }
  return getComputedStyle(el).fontFamily.split(",")[0].trim().replace(/['"]/g, '').trim();
}

Vue.prototype.$getElementFont = function(el) {
  const fontFamily = this.$getElementFontFamily(el);
  if (!fontFamily) {
    return fontFamily;
  }
  if (!(fontFamily in this.$demoFonts)) {
    return fontFamily;
  }
  const fontInfo = this.$demoFonts[fontFamily];
  return fontInfo.font;
}

export default {
  name: "GrandTour",
  components: {
    ControlPanel,
    MasterLayout,
  },
  data: () => ({
  }),
  mounted: function() {
    //add @font-face rules to stylesheet
    const fontFaceStyleID = 'grandtour-fontfaces-head';
    const fontFaceStyle = document.getElementById(fontFaceStyleID) || document.createElement('style');
    fontFaceStyle.id = fontFaceStyleID;
    document.head.appendChild(fontFaceStyle);

    let fontFaces = [];
    Object.keys(this.$demoFonts).forEach(fontname => {
      const fontinfo = this.$demoFonts[fontname];
      fontFaces.push('@font-face { font-family: "' + fontname + '"; src: url("' + fontinfo.url + '"); }');
      
      this.$fontkit.openURL(fontinfo.url, (err, font) => {
        if (font) {
          let ourFont = {};
          ourFont.axes = font.variationAxes;
          Vue.prototype.$demoFonts[fontname].font = ourFont;
        }
      });
    });
    fontFaceStyle.textContent = fontFaces.join("\n\n");
  }
};
