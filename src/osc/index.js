
// import { store } from './../store/index'
// import Vue from 'vue'
const osc = require('osc')
// const WebSocket = require('ws');

// const that = this
// const oscComm = (())
export default new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 7400,
    remoteAddress: "127.0.0.1",
    remotePort: 57120
});

// export { oscUdpPort }