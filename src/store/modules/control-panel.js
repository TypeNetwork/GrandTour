
export default {
  state: {
    controls: {},
  },
  getters: {
    getSomething: () => {
    },
  },
  mutations: {
    addControl(state, payload) {
      if (!('id' in payload)) {
        throw "controlPanels.addControl: no id in payload";
      }
      state.controls[payload.id] = payload;
      console.log(state.controls);
    },
  },
  actions: {
    registerControl: (context, payload) => {
      context.commit('addControl', payload);
    },
  }
}

