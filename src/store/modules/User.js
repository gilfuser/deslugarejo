export default {
  namespaced: true,
  state () {
    return {
      user: null
    }
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {
  },
  getters: {
  }
}