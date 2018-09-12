import Vue from 'vue'
import io from 'socket.io-client'
// const socket = io(process.env.WS_URL)
const socket = io()

// export default socket
Vue.use(socket)

export default socket

// export default ({ app }, inject) => {
//   // Set `i18n` instance on `app`
//   // This way we can use it in middleware and pages `asyncData`/`fetch`
//   app.i18n = new VueI18n({
//     /* `VueI18n` options... */
//   })
// }