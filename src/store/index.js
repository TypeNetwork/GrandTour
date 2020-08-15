import Vue from 'vue';


//draggable control panel;
import drag from "v-drag";
Vue.use(drag);


//global store
import Vuex from 'vuex';
Vue.use(Vuex);

import fonts from "./modules/fonts";
import controlPanel from "./modules/control-panel";

const store = new Vuex.Store({
  modules: { 
    fonts,
    controlPanel 
  },
});

export default store;

