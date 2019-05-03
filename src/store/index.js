import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import createPersistedState from "vuex-persistedstate";
import Cookies from "js-cookie";
import channel from '@/store/modules/Channel'
import channels from '@/store/modules/Channels'
// import swarm from '@/store/modules/Swarm'
import user from '@/store/modules/User'
import osc from '@/store/modules/Osc'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      // paths: ["index", "modules/Channels", 'modules/Osc'],
      storage: {
        getItem: key => Cookies.get(key),
        setItem: (key, value) =>
          Cookies.set(key, value, { expires: 3, secure: true }),
        removeItem: key => Cookies.remove(key)
      }
    })
  ],
  modules: {
    channel,
    channels,
    // swarm,
    user,
    osc
  },
  state: {
    name: null,
    isSignedIn: false,
    menuItems: [
      { id: 'logIn', icon: 'assignment_ind', title: 'Log In', to: '/login' },
      { id: 'signUp', icon: 'assignment', title: 'Sign Up', to: '/sign-up' }
    ],
    logOutIn: null
  },
  mutations: {
    setName(state, payload) {
      state.name = payload
    },
    isSignedIn(state, payload) {
      state.isSignedIn = payload
    },
    setMenuItems(state, payload) {
      state.menuItems = payload
    },
    setLogOutIn(state, payload) {
      state.logOutIn = payload
    }
  },
  actions: {
    signIn ({ commit }) {
      commit('setMenuItems', {
        createdChannels: {},
        createChannel: {
          icon: 'radio',
          title: 'Create Channel',
          to: '/create-channel'
        },
        joinChannel: {
          icon: 'radio',
          title: 'Join Channel',
          to: '/join-channel'
        }
      })
      router.push('/')
    },
    logOutIn ({ commit, state }) {
      if (state.isSignedIn) {
        commit('setLogOutIn', {
          name: {
          // icon: 'person',
            title: state.name
            // to: '/about'
          },
          logOut: { title: 'Log Out' }
        })
      } else {
        commit('setMenuItems', [
          { id: 'logIn', icon: 'assignment_ind', title: 'Log In', to: '/login' },
          { id: 'signUp', icon: 'assignment', title: 'Sign Up', to: '/sign-up' }
        ])
        commit('setLogOutIn', {})
      }
    }
  },
  getters: {
    name: state => state.name,
    menuItems: state => state.menuItems,
    logOutIn: state => state.logOutIn,
  }
})
