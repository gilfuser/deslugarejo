/* eslint-disable prettier/prettier */
import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      channel: undefined,
      createdChannels: [],
      joinedChannels: [],
      menuItems: [
        { id: 'signin', icon: 'assignment', title: 'Sign Up', to: '/signUp' },
        { id: 'login', icon: 'assignment_ind', title: 'Log In', to: '/about' }
      ],
      swarms: [],
      signedUp: false,
      name: undefined,
      initiator: undefined,
      user: null,
      users: [],
      connected: false,
      createdChannel: {
        label: undefined,
        type: undefined,
        initiator: undefined,
        uuid: undefined,
        description: undefined,
        date: undefined,
        joinedIn: [],
        oscClient: {}
      },
      loadedChannels: [
        {
          label: 'POIU',
          type: 'all-2-all',
          uuid: 'Lara',
          description: 'poipoipoipoipoipoipoi',
          date: '2019-4-1-20-13-11',
          joinedIn: ['Lara'],
          isJoined: false
        }
      ]
      // createdChannels: []
    },
    mutations: {

      channel (state, payload) {
        state.channel = payload
      },
      setName (state, name) {
        state.name = name
      },
      setInitiator (state, payload) {
        state.initiator = payload
      },
      setUser (state, payload) {
        state.user = payload
      },
      createChannel (state, payload) {
        state.createdChannel = payload
        // state.createdChannels[`${payload.label}`] = payload
        // state.menuItems.createdChannels[`${payload.label}`] = payload
        state.createdChannels.unshift(payload)
      },
      joinChannel (state, payload) {
        payload.joinedIn.push(state.name)
        payload.isJoined = true
        payload.uuid = state.name
        state.joinedChannels.unshift(payload)
      },
      // addCreatedChannel (state, payload) {
      // },
      isSignedUp (state, payload) {
        state.signedUp = payload
      },
      setMenuItems (state, payload) {
        state.menuItems = payload
      },
      addMenuItems (state, payload) {
        state.menuItems.unshift(payload)
      },
      isConnected (state, payload) {
        state.connected = payload
      },
      addSwarm (state, payload) {
        state.swarms.unshift(payload)
      },
      oscClientHost (state, payload) {
        state.oscClient.host = payload
      },
      oscclientPort (state, payload) {
        state.oscClient.port = payload
      }
    },
    actions: {
      signUserUp ({ commit, state }, payload) {
        commit('setUser', payload)
        commit('isConnected', true)
        commit('setMenuItems', {
          // {
          // icon: 'apps',
          // title: 'Welcome', to: '/' },
          createdChannels: {},
          createChannel: {
            // icon: 'radio',
            title: 'Create Channel',
            to: '/createChannel'
          },
          joinChannel: {
            // icon: 'radio',
            title: 'Join Channel',
            to: '/joinChannel'
          }, // TODO: fetch it from firebase
          name: {
            // icon: 'person',
            title: state.name,
            to: '/about'
          }
        })
      },
      onCreateSwarm ({ commit }, payload) {
        return new Promise((resolve, reject) => {
          commit('addSwarm', this.$mySwarm(payload.label, payload.initiator, payload.uuid))
          resolve()
        })
      }
    },
    getters: {
      menuItems: state => state.menuItems,
      createdChannels: state => state.createdChannels.sort((channelA, channelB) => { return channelA.date < channelB.date }),
      joinedChannels: state => state.joinedChannels.sort((channelA, channelB) => { return channelA.date < channelB.date }),
      remoteChannels: state => state.loadedChannels.sort((channelA, channelB) => { return channelA.date < channelB.date }),
      initiator: state => state.initiator,
      loadChannel: state => channelLabel => {
        if (state.initiator === true) {
          return state.createdChannels.find(channel => channel.label === channelLabel)
        } else if (state.initiator === false) {
          return state.loadedChannels.find(channel => channel.label === channelLabel)
        }
      },
      user: state => state.user,
      name: state => state.name,
      channel: state => state.channel,
      swarms: state => (chan) => {
        return state.swarms.find(swarm => swarm.channelConfig.label === chan)
      },
      oscClientPort: state => state.oscClient.port,
      oscClientHost: state => state.oscClient.host
    }
  })
}
export default createStore
