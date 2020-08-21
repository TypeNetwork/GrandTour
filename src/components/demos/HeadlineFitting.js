
export default {
  name: "HeadlineFitting",
  data: () => ({
    font: null,
    axisRanges: {},
    width: 20,
    height: 36,
    xtra: null,
  }),
  computed: {
    h1Style() { 
      return {
        width: `${this.width}rem`,
        fontSize: `${this.height}px`,
        fontVariationSettings: `"XTRA" ${this.xtra}`,
      }; 
    },
  },
  methods: {
    setHeight() {
//       this.$refs.h1.style.fontSize = this.height;
      this.$store.commit('setRulerStyles', this.$refs.h1);
      this.xtra = this.$store.getters.fitAxisToWidth({
        font: this.font,
        axis: 'XTRA',
        text: this.$refs.h1.textContent,
        width: this.$refs.h1.clientWidth,
      });
    }
  },
  mounted() {
    this.$store.dispatch('elementFont', this.$refs.h1).then(font => {
      this.font = font;
      let axisRanges = {};
      Object.keys(this.font.axes).forEach(axis => {
        axisRanges[axis] = [
          this.font.axes[axis].min,
          this.font.axes[axis].max,
        ];
      });
      this.axisRanges = axisRanges;
      this.setHeight();
    }).catch(err => {
      console.log(err);
    });
  },
};
