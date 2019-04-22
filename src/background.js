'use strict'

const path = require('path')
// const OSC = require('osc-js')
// const url = require('url')
// const Server = require('./server');
// const options = require('./options');
import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib'
//--------------------------------------------------
//  Bi-Directional OSC messaging Websocket <-> UDP
//--------------------------------------------------
// const osc = require('osc')
// const WebSocket = require('ws');

// const getIPAddresses = function () {
//   const os = require("os")
//   const interfaces = os.networkInterfaces()
//   let ipAddresses = [];
//     for (let deviceName in interfaces){
//         let addresses = interfaces[deviceName];
//         for (let i = 0; i < addresses.length; i++) {
//             let addressInfo = addresses[i];
//             if (addressInfo.family === "IPv4" && !addressInfo.internal) {
//                 ipAddresses.push(addressInfo.address);
//             }
//         }
//     }
//     return ipAddresses;
// };

// let udp = new osc.UDPPort({
//     localAddress: "0.0.0.0",
//     localPort: 7400,
//     remoteAddress: "127.0.0.1",
//     remotePort: 57120
// });

// udp.on("ready", function () {
//     var ipAddresses = getIPAddresses();
//     console.log("Listening for OSC over UDP.");
//     ipAddresses.forEach(function (address) {
//         console.log(" Host:", address + ", Port:", udp.options.localPort);
//     });
//     console.log("Broadcasting OSC over UDP to", udp.options.remoteAddress + ", Port:", udp.options.remotePort);
// });

// var wss = new WebSocket.Server({
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

//   udp.open();

//   udp.on("ready", function () {
//     console.log("ready");
//     setInterval(function () {
//         console.log("sending osc...");
//         udp.send({
//             address: "/sending/every/second",
//             args: [1, 2, 3]
//         })
//     }, 5000);
// });

// // Listen for incoming OSC bundles.
// udp.on("bundle", function (oscBundle, timeTag, info) {
//     console.log("An OSC bundle just arrived for time tag", timeTag, ":", oscBundle);
//     console.log("Remote info is: ", info);
// });

// const server = new Server(options);
const isDevelopment = process.env.NODE_ENV !== 'production'
let win
const devServer = process.env.WEBPACK_DEV_SERVER_URL
// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true })

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600, icon: path.join(__dirname, 'assets/icons/png/64x64.png') })
  if (devServer) {
    // Load the url of the dev server if in dev mode
    win.loadURL(devServer)
    // server = http.createServer(devServer)
    if (!process.env.IS_TEST)
      win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    // server = http.createServer('app://./index.html')
  }
  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }

  // server.stop();
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// const config = { udpClient: { port: 57120 } }
// const osc = new OSC({ plugin: new OSC.BridgePlugin(config) })

// osc.open() // start a WebSocket server on port 8080

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()

  // udp.open();
  // server.start();
  // server.hello();
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// http.listen(PORT, () => { console.log(`Server started on port ${PORT}`); });
