import Vue from 'vue';


//draggable control panel;
import drag from "v-drag";
Vue.use(drag);


//global store
import Vuex from 'vuex';
Vue.use(Vuex);

//our own vuex modules
import fonts from "./modules/fonts";
import controlPanel from "./modules/control-panel";
import measureText from "./modules/measure-text";

const store = new Vuex.Store({
  modules: { 
    fonts,
    controlPanel,
    measureText,
  },
});

export default store;

