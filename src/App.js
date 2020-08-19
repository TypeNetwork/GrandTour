import ControlPanel from "./components/ControlPanel.vue";
import MasterLayout from "./components/MasterLayout.vue";

export default {
  name: "GrandTour",
  components: {
    ControlPanel,
    MasterLayout,
  },
  data: () => ({
    literallyStyle: 'style',
  }),
  computed: {
    fontFaces() {
      let fontfaces = [];
      for (let fontname in this.$store.state.fonts.fonts) {
        let fontinfo = this.$store.state.fonts.fonts[fontname];
        fontfaces.push('@font-face { font-family: "' + fontname + '"; src: url("' + fontinfo.url + '"); }');
      }
      return fontfaces.join("\n\n");
    }
  },
  methods: {
  },
  mounted: function() {
    this.$store.commit('createRuler', this.$refs.ruler);
  }
};
