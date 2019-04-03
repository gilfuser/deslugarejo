/* eslint-disable prettier/prettier */
import Vuex from 'vuex'
import firebase from '~/plugins/firebase.js'
// eslint-disable-next-line no-unused-vars
import { firebaseMutations, firebaseAction } from 'vuexfire'
import signalhub from 'signalhub'
import createSwarm from 'webrtc-swarm'
import wrtc from 'wrtc'
const db = firebase.database()
// eslint-disable-next-line no-unused-vars
const usersRef = db.ref('/users')

const createStore = () => {
  return new Vuex.Store({
    state: {
      menuItems: [
        { icon: 'assignment', title: 'Sign Up', to: '/signUp' },
        { icon: 'assignment_ind', title: 'Log In', to: '/logIn' }
      ],
      swarm: undefined,
      signedUp: false,
      name: undefined,
      user: null,
      users: [],
      connected: false,
      createdChannel: {
        label: undefined,
        type: undefined,
        initiator: undefined,
        description: undefined,
        date: undefined,
        joinedIn: []
      },
      oscClient: {
        host: undefined,
        port: undefined
      },
      incomingMsgs: [
        {
          from: 'Zezé Totó',
          address: '/incoming/',
          argument: 0.2
        },
        {
          from: 'marineide',
          address: '/inc2/',
          argument: 0.4
        }
      ],
      outgoingMsgs: [
        {
          arrdress: '/outgoing/',
          argument: 0.2
        },
        {
          address: '/out2/',
          argument: 0.4
        }
      ],
      loadedChannels: [
        {
          label: 'aldaslk',
          type: 'all-2-all',
          initiator: 'adc',
          description: 'Um canal paranormal!',
          date: '2018-09-17',
          joinedIn: []
        },
        // { divider: true, inset: true },
        {
          label: 'openGLMadness',
          type: 'one-2-all',
          initiator: 'bumba!',
          description:
            "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.",
          date: '2018-09-18',
          joinedIn: []
        },
        // { divider: true, inset: true },
        {
          label: 'SuperCollider_RULEZ',
          type: 'all-2-all',
          initiator: 'f',
          description: '',
          date: '2018-09-19',
          joinedIn: []
        }
      ],
      createdChannels: [],
      joinedChannels: []
    },
    mutations: {
      setName (state, name) {
        state.name = name
      },
      setUser (state, payload) {
        state.user = payload
      },
      createChannel (state, payload) {
        state.createdChannel = payload
        state.createdChannels.unshift(payload)
      },
      isSignedUp (state, payload) {
        state.signedUp = payload
      },
      setMenuItems (state, payload) {
        state.menuItems = payload
      },
      addMenuItems (state, payload) {
        state.menuItems.unshift(payload)
      },
      addCreatedChannel (state, payload) {
        state.createdChannels.unshift(payload)
      },
      addJoinedChannel (state, payload) {
        state.joinedChannels.unshift(payload)
      },
      isConnected (state, payload) {
        state.connected = payload
      },
      setSwarm (state, payload) {
        state.swarm = payload
      },
      ...firebaseMutations
    },
    actions: {
      signUserUp ({ commit, state }, payload) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              const newUser = {
                id: user.uid,
                enteredChannels: []
              }
              // eslint-disable-next-line no-console
              console.log(`user id: ${newUser}`)
              commit('setUser', newUser) // TODO: this is not working
            },
            commit('setMenuItems', [
              state.joinedChannels,
              state.createdChannels,
              // {
              // icon: 'apps',
              // title: 'Welcome', to: '/' },
              {
                // icon: 'radio',
                title: 'Create Channel',
                to: '/createChannel'
              },
              {
                // icon: 'radio',
                title: 'Join Channel',
                to: '/joinChannel'
              }, // TODO: fetch it from firebase
              {
                // icon: 'person',
                title: state.name,
                to: '/about'
              }
            ])
          )
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error)
          })
      },
      onCreateSwarm ({ commit, state }) {
        commit(
          'setSwarm',
          createSwarm(
            signalhub(state.channel.label, [
              'https://serversignaling.herokuapp.com/'
            ]),
            {
              initiator: true,
              wrtc,
              uuid: state.name,
              trikle: false,
              channelConfig: {
                label: state.createdChannel.label,
                reliable: false,
                maxRetransmits: 0,
                ordered: false
                // TODO: Put the id in a data bank together with uuid
                // {uuid: zezé, id:123456} and fetch the label when a peer join a channel
                // options: { id: 123456 }
              }
            }
          )
        )
      }
    },
    getters: {
      loadedChannels (state) {
        return state.loadedChannels.sort((channelA, channelB) => {
          return channelA.date < channelB.date
        })
      },
      createdChannel (state) {
        return channelLabel => {
          return state.createdChannels.find(channel => {
            return channel.label === channelLabel
          })
        }
      },
      loadedChannel (state) {
        return channelLabel => {
          return state.loadedChannels.find(channel => {
            return channel.label === channelLabel
          })
        }
      },
      joinedChannel (state) {
        return channelLabel => {
          return state.joinedChannels.find(channel => {
            return channel.label === channelLabel
          })
        }
      },
      user (state) {
        return state.user
      },
      channel (state) {
        return state.createdChannel
      },
      swarm (state) {
        return state.swarm
      }
    }
  })
}

export default createStore
