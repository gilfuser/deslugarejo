const osc = require('osc')
// const WebSocket = require('ws');
export default {
  // eslint-disable-next-line
    install(Vue, options){
      // const { remotePort } = options
      const remotePort = 57120
      Vue.prototype.$udp = () => udp(remotePort)
    }
}

const getIPAddresses = function () {
  const os = require("os")
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
    return ipAddresses;
};

const udp = 
// (
  ( /* remotePort = 57120 */ remotePort ) => new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 7400,
    remoteAddress: "127.0.0.1",
    remotePort
})
udp.on("ready", function () {
  var ipAddresses = getIPAddresses();
  console.log("Listening for OSC over UDP.");
  ipAddresses.forEach(function (address) {
    console.log(" Host:", address + ", Port:", udp.options.localPort);
  });
  console.log("Broadcasting OSC over UDP to", this.options.remoteAddress + ", Port:", this.options.remotePort);
    setInterval(function () {
      console.log("sending osc...");
      udp.send({
        address: "/sending/every/second",
        args: [1, 2, 3]
      })
    }, 5000);
  })
  // )();
  
// let wss = new WebSocket.Server({
//     port: 8081
// });

// wss.on("connection", function (socket) {
//     console.log("A Web Socket connection has been established!");
//     var socketPort = new osc.WebSocketPort({
//         socket: socket
//     });
// // eslint-disable-next-line
//     var relay = new osc.Relay(udp, socketPort, {
//         raw: true
//     });
// });

  // udp.open();

// Listen for incoming OSC bundles.
// udp.on("bundle", function (oscBundle, timeTag, info) {
//     console.log("An OSC bundle just arrived for time tag", timeTag, ":", oscBundle);
//     console.log("Remote info is: ", info);
// });
