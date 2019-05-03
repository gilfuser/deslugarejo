import osc from 'osc'
import os from 'os'

export default {
  namespaced: true,
  state () {
    return {
      ports:[],
    }
  },
  mutations: {
    add (state, payload) {
      const index = state.ports.findIndex(port => port.title === payload.title)
      if (index === -1) {
        state.ports.unshift(payload)
      }
    },
    clear: state => state.ports = [],
    remove (state, payload) {
      const index = state.ports.findIndex(port => port.title === payload.title)
      if (index !== -1) {
        state.ports.splice(index, 1)
      }
    },
    set (state, payload) {
      const index = state.ports.findIndex(port => port.title === payload.title)
      if (index !== -1) {
        state.ports[index].oscPort = payload.oscPort
        const oscPort = state.ports[index].oscPort
        // const msgOut = 
        oscPort.open()
        oscPort.on("ready", function () {
        console.log("Listening for OSC over UDP.");
        payload.ipAddresses.forEach(function (address) {
          console.log(" Host:", address + ", Port:", oscPort.options.localPort);
          })
          console.log("Broadcasting OSC over UDP to", oscPort.options.remoteAddress + ", Port:", oscPort.options.remotePort)
          oscPort.on('message', function (oscMessage) {
            state.ports[index].msgOut = oscMessage
            console.log('message: ', oscMessage)
          })
        })
        state.ports[index].sendMsg = payload.sendMsg
      }
    },
  },
  getters: {
    oscPort: state => payload => {
      const index = state.ports.findIndex(port => port.title === payload)
      if (index !== -1) {
        return state.ports[index].oscPort
      }
    },
    msgOut: state => payload => {
      const index = state.ports.findIndex(port => port.title === payload)
      if (index !== -1) {
        return state.ports[index].msgOut
      }
    }
  },
  actions: {
    msgIn({ state }, payload) {
      const index = state.ports.findIndex(port => port.title === payload.title)
      if (index !== -1) {
        const port = state.ports[index].oscPort
        const sendMsg = state.ports[index].sendMsg
        sendMsg(port, payload.msg)
      }
    },
    createOscPort({ commit }, payload) {
      const interfaces = os.networkInterfaces()
      let ipAddresses = [];
      for (let deviceName in interfaces){
        let addresses = interfaces[deviceName];
        for (let i = 0; i < addresses.length; i++) {
          let addressInfo = addresses[i];
          if (addressInfo.family === "IPv4" && !addressInfo.internal) {
            ipAddresses.push(addressInfo.address);
          }
        }
      }
      commit('add', {
        title: payload.title,
        oscPort: null,
        msgOut: {
          addr: null,
          args: null
        },
        swarm: false,
      })
      commit('set', {
        title: payload.title,
        oscPort: new osc.UDPPort({
          localAddress: '0.0.0.0',
          localPort: 7400,
          remoteAddress: payload.remoteAddress,
          remotePort: payload.remotePort,
        }),
        ipAddresses: ipAddresses,
        sendMsg: function (port, msg) {
            port.send(msg)
          }
      })
      }
    },
  }
