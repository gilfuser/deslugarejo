//--------------------------------------------------
//  Bi-Directional OSC messaging Websocket <-> UDP
//--------------------------------------------------

const osc = require('osc')
const os = require("os")

export default {
  namespaced: true,
  state () {
    return {
      channel: null,
      channels:[
        {
          title: 'chanchan',
          oscPort: null,
        }
      ],
      localAddress: '0.0.0.0',
      localPort: 7400,
      remoteAddress: '127.0.0.1',
      remotePort: 57120,
      // ipAddresses: null
    }
  },
  mutations: {
    setRemotePort (state, payload) {
      state.remotePort = payload
    },
    setRemoteAddress (state, payload) {
      state.remoteAddress = payload
    },
    setIpAddress (state, payload) {
      state.ipAddresses = payload
    },
    add (state, payload) {
      const index = state.channels.findIndex(channel => channel.title === payload.title)
      if (index === -1) {
        state.channels.unshift(payload)
      }
    },
    clear: state => state.channels = [],
    // set (state, payload) {
    //   const index = state.channels.findIndex(channel => channel.title === payload.title)
    //   if (index !== -1) {
    //     state.channels[index].oscPortSettings = payload.oscPortSettings
    //   }
    // },
    remove (state, payload) {
      const index = state.channels.findIndex(channel => channel.title === payload.title)
      if (index !== -1) {
        state.channels.splice(index, 1)
      }
    },
    setChannel (state, payload) {
      state.channel = state.channels.find(channel => channel.title === payload)
    },
    setOscPort (state, payload) {
      const index = state.channels.findIndex(channel => channel.title === payload.title)
      if (index !== -1) {
        state.channels[index].oscPort = payload.oscPort
        const oscPort = state.channels[index].oscPort
        oscPort.open()
        oscPort.on("ready", function () {
        console.log("Listening for OSC over UDP.");
        payload.ipAddresses.forEach(function (address) {
          console.log(" Host:", address + ", Port:", oscPort.options.localPort);
          })
          console.log("Broadcasting OSC over UDP to", oscPort.options.remoteAddress + ", Port:", oscPort.options.remotePort)
          oscPort.on('message', function (oscMessage) {
            // (message).text(JSON.stringify(oscMessage, undefined, 2));
            console.log('message: ', oscMessage)
          })
        })
        //eslint-disable-next-line
        state.channels[index].sendMsg = payload.sendMsg
      }
    }
  },
  getters: {
    remoteAddress: state => state.remoteAddress,
    remotePort: state => state.remotePort,
    ipAddresses: state => state.ipAddresses,
    oscPort: state => payload => {
      const index = state.channels.findIndex(channel => channel.title === payload)
      if (index !== -1) {
        state.channels[index].oscPort
      }
    }
  },
  actions: {
    sendMsg({ state }, payload) {
      const index = state.channels.findIndex(channel => channel.title === payload.title)
      if (index !== -1) {
        const port = state.channels[index].oscPort
        const sendMsg = state.channels[index].sendMsg
        // send(payload.msg)
        sendMsg(port, payload.msg)
        // console.log('type of sendMsg ', typeof send);
      }
    },
    createOscPort({ commit, getters }, payload) {
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
      commit('setOscPort', {
        title: payload,
        oscPort: new osc.UDPPort({
          localAddress: "0.0.0.0",
          localPort: 7400,
          remoteAddress: getters.remoteAddress,
          remotePort: getters.remotePort,
        }),
        ipAddresses,
        sendMsg: function (port, msg) {
            port.send(msg)
            // console.log('this port is ', port, 'msg: ', msg)
          }
      })
      }
    },
  }
