
import "../../lib/fontkit/fontkit";

var fontkit = window.fontkit;
fontkit.openURL = function(url, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  var fkFont = null;
  xhr.onload = function () {
    if (this.status == 200) {
      var fkBlob = this.response;
      var fkBuffer = new Buffer(fkBlob);
      fkFont = fontkit.create(fkBuffer);
      if (callback) {
        callback(null, fkFont);
      }
    } else if (callback) {
      callback(this.status, null);
    }
  };
  xhr.send();
};

export default {
  state: {
    fonts: {
      AmstelvarRoman: {
        url: "fonts/Amstelvar-Roman-VF.woff2",
      },
      AmstelvarItalic: {
        url: "fonts/Amstelvar-Italic-VF.woff2",
      },
    }
  },
  getters: {
    elementFontFamily: () => (el) => {
      if (!(el instanceof HTMLElement)) {
        return null;
      }
      return getComputedStyle(el).fontFamily.split(",")[0].trim().replace(/['"]/g, '').trim();
    },
  },
  actions: {
    elementFont: (context, el) => {
      const fontFamily = context.getters.elementFontFamily(el);
      if (!fontFamily) {
        return Promise.reject("Element doesn't exist");
      }
      if (!(fontFamily in context.state.fonts)) {
        return Promise.reject('Unknown font family "' + fontFamily + '"');
      }
      const fontInfo = context.state.fonts[fontFamily];
      if ('font' in fontInfo) {
        return Promise.resolve(fontInfo.font);
      } else {
        return new Promise((resolve, reject) => {
          fontkit.openURL(fontInfo.url, (err, font) => {
            if (font) {
              let ourFont = {
                cssName: fontFamily,
                fullName: font.name.records.fullName,
              };
              ourFont.axes = font.variationAxes;
              context.state.fonts[fontFamily].font = ourFont;
              resolve(ourFont);
            } else {
              reject(err);
            }
          });
        });
      }
    },
  }
}

