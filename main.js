/*
**  Nuxt
*/
const http = require('http')
const { Nuxt, Builder } = require('nuxt-edge')
let config = require('./nuxt.config.js')
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
let args

const socketIO = require('socket.io')
const osc = require('node-osc')
const io = socketIO(server)

function objArray() {
	return Array.from(arguments)
}

io.on('connection', (socket) => {

	socket.on('error', function(e) {
		console.error(e);
		console.error(e.stack);
	});
	socket.on('disconnect', function() {
		console.error("disconnected");
	});

	socket.on('config', function (obj) {
		oscServer = new osc.Server(obj.server.port, obj.server.host);
		oscClient = new osc.Client(obj.client.host, obj.client.port);
		console.log('config', obj);
		oscClient.send('/status', socket.id + ' connected');
		oscServer.on('message', function (msg, rinfo) {
			socket.emit('thisMachine', msg);
			console.log('osc msg from this machine', msg);
		});
	});
	socket.on('browser', function (obj) {
		if( Number(obj[1]) !== NaN ) {
			args = Number(obj[1])
		} else {
			args = obj[1]
		}
		oscClient.send(obj[0], args);
		// console.log(`browser: obj: ${obj} obj.length: ${obj.length} obj[0]: ${obj[0]}  address: ${obj[0]}  obj[1]: ${obj[1]} args: ${args}`);
	});
	// socket.on('remoteMachine', function (obj) {
	//   // oscClient.send(obj.address, obj.args)
	//   console.log(`osc from remote machine: address: ${obj.address}, address: ${obj}`);
	// });
});

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
	win.on('closed', () => win = null)
	if (config.dev) {
		// Install vue dev tool and open chrome dev tools
		const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')
		installExtension(VUEJS_DEVTOOLS.id).then(name => {
			console.log(`Added Extension:  ${name}`)
			win.webContents.openDevTools()
		}).catch(err => console.log('An error occurred: ', err))
		// Wait for nuxt to build
		const pollServer = () => {
			http.get(_NUXT_URL_, (res) => {
				if (res.statusCode === 200) { win.loadURL(_NUXT_URL_) } else { setTimeout(pollServer, 300) }
			}).on('error', pollServer)
		}
		pollServer()
	} else { return win.loadURL(_NUXT_URL_) }
}
app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())
