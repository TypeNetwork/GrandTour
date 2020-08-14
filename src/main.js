import Vue from "vue";
import store from "./store";
import App from "./App.vue";
import PortalVue from 'portal-vue'

Vue.config.productionTip = false;
Vue.use(PortalVue)

new Vue({
  render: h => h(App),
  store
}).$mount("#app");
