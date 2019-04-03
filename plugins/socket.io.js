import io from 'socket.io-client'
// const socket = io(process.env.WS_URL)
const socket = io.connect()

export default socket
