import Vue from 'vue';
import Vuex from 'vuex';

//modules
import fonts from "./modules/fonts";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: { fonts },
});

export default store;

