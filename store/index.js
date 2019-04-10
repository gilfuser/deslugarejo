/* eslint-disable prettier/prettier */
import { fireDb } from '@/plugins/firebase'
const channelsRef = fireDb.collection('channels')

export const state = () => ({
  menuItems: [
    { id: 'signin', icon: 'assignment', title: 'Sign Up', to: '/signUp' },
    { id: 'login', icon: 'assignment_ind', title: 'Log In', to: '/about' }
  ],
  swarms: [],
  signedIn: false,
  signedOut: true,
  name: undefined,
  initiator: undefined,
  user: null,
  users: [],
  connected: false,
  channel: null,
  createdChannels: [
  ],
  joinedChannels: [
  ],
  createdChannel: {
    label: undefined,
    type: undefined,
    initiator: undefined,
    uuid: undefined,
    description: undefined,
    date: undefined,
    joinedIn: [],
    oscClient: {
      host: null,
      port: null
    }
  },
  remoteChannels: [
  ],
  unsubscribe: null
})
export const mutations = {
  init (state, payload) {
    state.remoteChannels = payload
  },
  add (state, payload) {
    state.remoteChannels.push(payload)
  },
  set (state, payload) {
    const index = state.remoteChannels.findIndex(channel => channel.title === payload.title)
    if (index !== -1) {
      state.remoteChannels[index] = payload
    }
  },
  remove (state, payload) {
    const index = state.remoteChannels.findIndex(channel => channel.title === payload.title)
    if (index !== -1) {
      state.remoteChannels.splice(index, 1)
    }
  },
  setName (state, payload) {
    state.name = payload
  },
  setUser (state, payload) {
    state.user = payload
  },
  isSignedIn (state, payload) {
    state.signedIn = payload
  },
  signOut (state, payload) {
    state.signedOut = payload
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
  channel (state, payload) {
    state.channel = payload
  },
  setInitiator (state, payload) {
    state.initiator = payload
  },
  setChannel (state, payload) {
    state.createdChannel = payload
    state.createdChannels.unshift(payload)
  },
  joinChannel (state, payload) {
    payload.joinedIn.push(state.name)
    payload.isJoined = true
    payload.uuid = state.name
    state.joinedChannels.unshift(payload)
  },
  oscClientHost (state, payload) {
    state.createdChannel.oscClient.host = payload
  },
  oscClientPort (state, payload) {
    state.createdChannel.oscClient.port = payload
  }
}
export const actions = {
  clear ({ commit }) {
    commit('init', [])
  },
  startListener ({ commit }) {
    if (this.unsubscribe) {
      console.warn('listener is running. ', this.unsubscribe)
      this.unsubscribe()
      this.unsubscribe = null
    }
    // 3. retrieving data from Firestore
    this.unsubscribe = channelsRef.orderBy('releasedAt', 'asc').onSnapshot(querySnapshot => {
      // 6 . data is called each time it is updated
      querySnapshot.docChanges().forEach(change => {
        const payload = {
          // id: change.doc.id,
          title: change.doc.data().title,
          to: `/channels/${this.label}`,
          label: change.doc.data().label,
          uuid: change.doc.data().uuid,
          type: change.doc.data().type,
          joinedIn: change.doc.data().joinedIn,
          // oscClient: {
          //   host: change.doc.data().host,
          //   port: change.doc.data().port
          // },
          description: change.doc.data().description,
          releasedAt: new Date(change.doc.data().releasedAt.seconds * 1000)
        }

        // 4. Update state through mutation
        if (change.type === 'added') {
          commit('add', payload)
        } else if (change.type === 'modified') {
          commit('set', payload)
        } else if (change.type === 'removed') {
          commit('remove', payload)
        }
      })
    },
    (error) => {
      console.error(error.name)
    })
  },
  // 8. Stop the listener
  stopListener () {
    if (this.unsubscribe) {
      console.log('listener is stopping. ', this.unsubscribe)
      this.unsubscribe()
      this.unsubscribe = null
    }
  },
  addChannel ({ commit }, payload) {
    channelsRef.add(payload)
      .then(doc => {
        // Do not mutate vuex store state outside mutation handlers.
      })
      .catch(err => {
        console.error('Error adding channel: ', err)
      })
  },
  deleteChannel ({ commit }, payload) {
    channelsRef.doc(payload.title).delete()
      .then(() => {
        // Do not mutate vuex store state outside mutation handlers.
      })
      .catch(err => {
        console.error('Error removing document: ', err)
      })
  },
  signIn ({ commit, state }, payload) {
    commit('setUser', payload)
    commit('isSignedIn', true)
    commit('signOut', false)
    commit('setMenuItems', {
      createdChannels: {},
      createChannel: {
        icon: 'radio',
        title: 'Create Channel',
        to: '/createChannel'
      },
      joinChannel: {
        icon: 'radio',
        title: 'Join Channel',
        to: '/joinChannel'
      },
      name: {
        icon: 'person',
        title: state.name,
        to: '/about'
      }
    })
    this.$router.push('/')
  }
  // signUserUp ({ commit, state }, payload) {
  //   commit('setUser', payload)
  //   commit('isConnected', true)
  //   commit('setMenuItems', {
  //     // {
  //     // icon: 'apps',
  //     // title: 'Welcome', to: '/' },
  //     createdChannels: {},
  //     createChannel: {
  //       // icon: 'radio',
  //       title: 'Create Channel',
  //       to: '/createChannel'
  //     },
  //     joinChannel: {
  //       // icon: 'radio',
  //       title: 'Join Channel',
  //       to: '/joinChannel'
  //     },
  //     name: {
  //       // icon: 'person',
  //       title: state.name,
  //       to: '/about'
  //     }
  //   })
  // },
  // onCreateSwarm ({ commit }, payload) {
  //   return new Promise((resolve, reject) => {
  //     commit('addSwarm', this.$mySwarm(payload.label, payload.initiator, payload.uuid))
  //     resolve()
  //   })
  // }
}
export const getters = {
  menuItems: state => state.menuItems,
  user: state => state.user,
  name: state => state.name,
  swarms: state => (chan) => {
    return state.swarms.find(swarm => swarm.channelConfig.label === chan)
  },
  createdChannel: state => state.createdChannel,
  createdChannels: state => state.createdChannels,
  joinedChannels: state => state.joinedChannels,
  remoteChannels: state => state.remoteChannels,
  // .sort((channelA, channelB) => { return channelA.date < channelB.date }),
  initiator: state => state.initiator,
  loadChannel: state => channelLabel => {
    if (state.initiator === true) {
      return state.createdChannels.find(channel => channel.label === channelLabel)
    } else if (state.initiator === false) {
      return state.remoteChannels.find(channel => channel.label === channelLabel)
    }
  },
  channel: state => state.channel
  // oscClientPort: state => state.createdChannel.oscClient.port,
  // oscClientHost: state => state.createdChannel.oscClient.host
}
