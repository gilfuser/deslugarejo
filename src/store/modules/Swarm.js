import signalhub from 'signalhub'
import createSwarm from 'webrtc-swarm'
// import wrtc from 'wrtc'

export default {
  namespaced: true,
  state () {
    return {
      swarms: [
        {
        initiator: null,
        // wrtc,
        uuid: null,
        trikle: false,
        channelConfig: {
          label: null,
          reliable: false,
          maxRetransmits: 0,
          ordered: false
      // TODO: Put the id in a data bank together with uuid
      // {uuid: zezé, id:123456} and fetch the label when a peer join a channel
       // options: { id: 123456 }
        }
      }
    ]
    }
  },
  mutations: {
    setSwarmInit (state, payload) {

    }
  }
}