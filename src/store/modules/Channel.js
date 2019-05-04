import CONSTANTS from '@/constants'

export default {
  namespaced: true,
  unsubscribe: null,
  state () {
    return {
      data: {}
    }
  },
  mutations: {
    set (state, payload) {
      state.data = payload
    }
  },
  getters: {
    data (state) {
      return state.data
    }
  },
  actions: {
    clear ({ commit }) {
      commit('set', CONSTANTS.NEW_EMPTY_MEMO())
    },
    startListener ({ commit }, payload) {
      if (this.unsubscribe) {
        console.warn('listener is running. ', this.unsubscribe)
        this.unsubscribe()
        this.unsubscribe = null
      }
      // this.unsubscribe = channelsRef.doc(payload.id).onSnapshot(doc => {
      //   commit('set', {
      //     id: doc.id,
      //     title: doc.data().title,
      //     description: doc.data().description,
      //     platforms: doc.data().platforms,
      //     million: doc.data().million,
      //     releasedAt: new Date(doc.data().releasedAt.seconds * 1000)
      //   })
      // })
    },
    stopListener () {
      if (this.unsubscribe) {
        console.log('listener is stopping. ', this.unsubscribe)
        this.unsubscribe()
        this.unsubscribe = null
      }
    },
    updateMillion ({ state }) {
      const million = !state.data.million
      // channelsRef.doc(state.data.id).update({ million: million })
      //   .then(() => {
      //     // Do not mutate vuex store state outside mutation handlers.
      //   })
      //   .catch(err => {
      //     console.error('Error updating document: ', err)
      //   })
    },
    updatePlatforms ({ state }, payload) {
      const platforms = [].concat(state.data.platforms)
      if (platforms.includes(payload.platform)) {
        platforms.splice(platforms.indexOf(payload.platform), 1)
      } else {
        platforms.push(payload.platform)
      }
      // channelsRef.doc(state.data.id).update({ platforms: platforms })
      //   .then(() => {
      //     // Do not mutate vuex store state outside mutation handlers.
      //   })
      //   .catch(err => {
      //     console.error('Error updating document: ', err)
      //   })
    }
  }
}