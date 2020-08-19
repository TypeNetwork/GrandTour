import Vue from "vue";
import store from "./store";
import App from "./App.vue";

Vue.config.productionTip = false;

// "casting" elements from one component into another
import PortalVue from 'portal-vue'
Vue.use(PortalVue)

// fancy form controls
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
Vue.use(Buefy)

new Vue({
  render: h => h(App),
  store,
}).$mount("#app");
