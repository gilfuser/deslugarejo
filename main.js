/* eslint-disable import/order */
/* eslint-disable no-console */
/*
 **  Nuxt
 */
const http = require('http')
const { Nuxt, Builder } = require('nuxt')
const config = require('./nuxt.config.js')
config.rootDir = __dirname // for electron-builder
// Init Nuxt.js
const nuxt = new Nuxt(config)
const builder = new Builder(nuxt)
const server = http.createServer(nuxt.render)
// Build only in dev mode
if (config.dev) {
  builder.build().catch(err => {
    console.error(err) // eslint-disable-line no-console
    process.exit(1)
  })
}
// Listen the server
server.listen()
const _NUXT_URL_ = `http://localhost:${server.address().port}`
console.log(`Nuxt working on ${_NUXT_URL_}`)

/*
 ** Socket.io + Node-Osc
 */

let oscServer
let oscClient

const socketIO = require('socket.io')
const osc = require('node-osc')
const io = socketIO(server)

io.on('connection', socket => {
  // eslint-disable-next-line prettier/prettier
  socket.on('error', function (e) {
    console.error(e)
    console.error(e.stack)
  })
  // eslint-disable-next-line prettier/prettier
  socket.on('disconnect', function () {
    console.error('disconnected')
  })
  // eslint-disable-next-line prettier/prettier
  socket.on('config', function (obj) {
    oscServer = new osc.Server(3333, '127.0.0.1')
    oscClient = new osc.Client(obj.client.host, obj.client.port)
    console.log('config', obj)
    oscClient.send('/status', socket.id + ' connected')
    // eslint-disable-next-line prettier/prettier
    oscServer.on('message', function (msg, rinfo) {
      // let oscPathOut = ''
      // let oscParamOut = ''
      // console.log('Server: msg from this machine', msg)
      // console.log('msg length ', msg.length)
      // for (let i = 0; i < msg.length; i++) {
      //   if (i % 2 === 0) {
      //     oscPathOut += msg[i]
      //     console.log(msg[i], typeof msg[i])
      //   } else {
      //     oscParamOut += msg[i]
      //     console.log(msg[i], typeof msg[i])
      //   }
      // }
      socket.emit('outgoing', msg
      // { path: oscPathOut, args: oscParamOut }
      )
    })
  })

  socket.on('incoming', function (obj) {
    const objIn = obj.toString().replace(/,/g, ', ').split(',')
    const objToOsc = objIn
    for (let i = 0; i < objIn.length; i++) {
      if (!isNaN(objIn[i])) {
        objToOsc[i] = +objIn[i]
      }
    }
    oscClient.send(objToOsc)
  })
})

/*
 ** Electron
 */
let win = null // Current window
const electron = require('electron')
const path = require('path')
const app = electron.app
const newWin = () => {
  win = new electron.BrowserWindow({
    icon: path.join(__dirname, 'assets/icons/png/64x64.png')
  })
  // win.maximize()
  win.on('closed', () => (win = null))
  if (config.dev) {
    // Install vue dev tool and open chrome dev tools
    const {
      default: installExtension,
      VUEJS_DEVTOOLS
    } = require('electron-devtools-installer')
    installExtension(VUEJS_DEVTOOLS.id)
      .then(name => {
        console.log(`Added Extension:  ${name}`)
        win.webContents.openDevTools()
      })
      .catch(err => console.log('An error occurred: ', err))
    // Wait for nuxt to build
    const pollServer = () => {
      http
        .get(_NUXT_URL_, res => {
          if (res.statusCode === 200) {
            win.loadURL(_NUXT_URL_)
          } else {
            setTimeout(pollServer, 300)
          }
        })
        .on('error', pollServer)
    }
    pollServer()
  } else {
    return win.loadURL(_NUXT_URL_)
  }
  // if (process.env.NODE_ENV !== 'production') {
  //   require('vue-devtools').install()
  // }
}
app.on('ready', newWin)
// app.on('ready', () => {
//   if (process.env.NODE_ENV !== 'production') {
//     require('vue-devtools').install()
//     // newWin.addDevToolsExtension('vue-devtools')
//   }
// })
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())
