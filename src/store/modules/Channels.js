/* eslint-disable */
import { fireDb } from '../../firebase'
import firebase from 'firebase/firebase'
const channelsRef = fireDb.collection('channels')

export default {
  namespaced: true,
  unsubscribe: null,
  state () {
    return {
      remoteChannels: [],
      createdChannels: [],
      joinedChannels: [],
      initiator: null,
    }
  },
  mutations: {
    setInitiator (state, payload) {
      state.initiator = payload
    },
    init (state, payload) {
      if (state.initiator === true) {
      state.createdChannels = payload
      } else if (state.initiator === false) {
      state.remoteChannels = payload
      }
    },
    add (state, payload) {
      if (state.initiator === true) {
        state.createdChannels.unshift(payload)
      } else if (state.initiator === false) {
        state.remoteChannels.unshift(payload)
      }
    },
    set (state, payload) {
      if (state.initiator === true) {
        const index = state.createdChannels.findIndex(channel => channel.title === payload.title)
        if (index !== -1) {
          state.createdChannels[index] = payload
        }
      } else if (state.initiator === false) {
        const index = state.remoteChannels.findIndex(channel => channel.title === payload.title)
        if (index !== -1) {
          state.remoteChannels[index] = payload
        }
      }
    },
    remove (state, payload) {
      if (state.initiator === true) {
        const index = state.createdChannels.findIndex(channel => channel.title === payload.title)
        if (index !== -1) {
          state.createdChannels.splice(index, 1)
        }
      } else if (state.initiator === false) {
        const index = state.remoteChannels.findIndex(channel => channel.title === payload.title)
        if (index !== -1) {
          state.remoteChannels.splice(index, 1)
        }
      }
    },
    joinChannel (state, payload) {
        const index = state.joinedChannels.findIndex(channel => channel.title === payload.title)
        if (index === -1) {
          state.joinedChannels.unshift(payload)
        }
    },
  },
  // 2. component monitors the state through getter 
  getters: {
    createdChannels (state) {
        return state.createdChannels
    },
    remoteChannels (state) {
        return state.remoteChannels
    },
    loadChannel: state => channelTitle => {
      if (state.initiator === true) {
        return state.createdChannels.find(channel => channel.title === channelTitle)
      } else if (state.initiator === false) {
        return state.remoteChannels.find(channel => channel.title === channelTitle)
      }
    },
    joinedChannels: state => state.joinedChannels
  },
  actions: {
    clear ({ commit }) {
      commit('init', [])
    },
    // 1. Start listener 
    startListener ({ commit }) {
      if (this.unsubscribe) {
        console.warn('listener is running. ', this.unsubscribe)
        this.unsubscribe()
        this.unsubscribe = null
      }
      // 3. retrieving channels from Firestore 
      this.unsubscribe = channelsRef.orderBy('releasedAt', 'asc').onSnapshot(querySnapshot => {
        // 6 . channels is called each time it is updated 
        querySnapshot.docChanges().forEach(change => {
          const payload = {
            // id: change.doc.id,
            title: change.doc.data().title,
            to: change.doc.data().to,
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
    // 8. リスナーの停止
    stopListener () {
      if (this.unsubscribe) {
        console.log('listener is stopping. ', this.unsubscribe)
        this.unsubscribe()
        this.unsubscribe = null
      }
    },
    addchannel ({ commit }, payload) {
      channelsRef.add(payload)
        .then(doc => {
          // Do not mutate vuex store state outside mutation handlers.
        })
        .catch(err => {
          console.error('Error adding document: ', err)
        })
    },
    deletechannel ({ commit }, payload) {
      channelsRef.doc(payload.title).delete()
        .then(() => {
          // Do not mutate vuex store state outstitlee mutation handlers.
        })
        .catch(err => {
          console.error('Error removing document: ', err)
        })
    },
    joinIn ({state, commit, rootState}, payload) {
      const index = state.remoteChannels.findIndex(channel => channel.title === payload.title)
      if (index !== -1 && !state.remoteChannels[index].joinedIn.includes(rootState.name)) {
        state.remoteChannels[index].joinedIn.push(rootState.name)
        channelsRef.doc(payload.title).update({
          joinedIn: state.remoteChannels[index].joinedIn
        }).then(() => {
            // Do not mutate vuex store state outside mutation handlers.
          })
          .catch(err => {
            console.error('Error updating document: ', err)
          })
        }
      commit('joinChannel', payload)
    },
    isLeft (rootState, payload) {
      channelsRef.doc(payload.title).update({
        isJoined: firebase.firestore.FieldValue.arrayRemove(rootState.name)
      })
    }
  }
}