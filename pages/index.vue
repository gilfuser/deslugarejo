<template>
<section class="section">
  <div class="container">
    <div class="home">
      <h1 class="title is-2">DESLUGAR</h1>
      <h2 class="subtitle is-4">non-local jamming</h2>
      <div class="block">
        <p>Jam with people using apps capable to communicate through OSC in their machines. Fast and directly from peer to peers thanks to WebRTC.</p>
        <!-- <fa :icon="['fas', 'handshake']"/> -->
      </div>
      <div class="section">
        <div class="columns">
          <div class="column" is-half>
            <button class="button">create channel</button>
          </div>
          <div class="column" is-half>
            <button class="button" :disabled="inexistOscGens">osc generators</button>
          </div>
        </div>
      </div>
      <p>name</p>
      <set-name :name="name" @set-name="onSetName" @accept-name="onAcceptName" />
      <p> {{ name }} </p>
      <hr>
      <p>create channel</p>
      <input type="text" placeholder="create-channel"
      @keydown.enter="channel = $event.target.value"
      @keyup.enter="channelCreateJoin">
      <p> {{ channel }} </p>
      <hr>
      <p>join channel</p>
      <input type="text" name="join-channel" id="join-channel"
      @keydown.enter="channel = $event.target.value"
      @keyup.enter="channelCreateJoin">
      <hr>
      <p>message</p>
      <input type="text" name="message" id="message" @keydown.enter="message = $event.target.value"
      @keyup.enter="submitMsg">
      <p> {{ message }} </p>
      <hr>
      <p>incoming message</p>
      <p> {{ incomingMsg }} </p>
      <hr>
      <p>connected = {{ connected }} </p>
    </div>
  </div>
</section>
</template>

<script>
import SetName from '@/components/set-name'
import signalhub from 'signalhub'
import createSwarm from 'webrtc-swarm'
import wrtc from 'wrtc'
import io from 'socket.io-client'
import { faHandRock } from '@fortawesome/free-regular-svg-icons'
// import ioc from '@/plugins/socket-io.js'

// var socket;
// if (process.browser) {
  // socket = ioc
// } else if (process.server) {
var socket = io.connect()
// }

const vm = {
  name: 'home',
  components: {
    SetName
  },
  data: () => ({
    inexistOscGens: true,
    name: undefined,
    swarm: undefined,
    channel: undefined,
    connected: false,
    address: '/test',
    address2: '/toast',
    message: undefined,
    incomingMsg: undefined,
    socketPortIn: 3333,
    socketPortOut: 57120,
    oscMsg: [],
    oscMsg2: [],
    socketOnMsg: undefined,
  }),
  methods: {
    onSetName(name) {
      this.$store.commit('changeName', { name })
    },
    onAcceptName() {
      this.name = this.$store.state.name
    },
    channelCreateJoin (init) {
      socket.emit('config', {
        server: { port: this.socketPortIn, host: '127.0.0.1' },
        client: { host: '127.0.0.1', port: this.socketPortOut },
      });
      let that = this
      this.swarm = createSwarm(signalhub(that.channel, [
        'https://serversignaling.herokuapp.com/'
      ]), {
        initiator: true,
        wrtc,
        uuid: that.name,
        trikle: false,
        channelConfig: {
          label: that.channel,
          ordered: false,
        // TODO: Put the id in a data bank together with uuid {uuid: zezé totó, id:123456} and fetch when a peer join a channel by the label
        // options: {
          // id: 123456
        // }
        },
      })
    },
    submitMsg () {
      let that = this
      // this.oscMsg = []
      this.oscMsg = [ this.address, this.message ]
      this.oscMsg2 = [ this.address2, this.message ]
      socket.emit('browser', this.oscMsg2)
      if (that.connected) {
        this.swarm.peers.forEach((peer) => {
          peer.send(this.oscMsg)
        })
      }
    },
  },
  beforeMount() {
    let that = this
    socket.on('thisMachine', function (msg) {
      // that.oscMsg = msg
        console.log('osc from this machine!', msg);
        if (that.connected) {
          that.swarm.peers.forEach((peer) => {
            peer.send(msg)
            console.log(`osc from this machine array ${peer}: ${msg}`);
            that.incomingMsg = msg
          })
      }
    })
  },
  watch: {
    swarm: function (swarm) {
      let that = this
      let dataArray
      swarm.on('connect', function (peer, id) {
        alert('connected');
        that.connected = true;
        peer.on('data', (data) => {
          that.incomingMsg = data.toString().split(',')
          // dataArray = that.incomingMsg.split(',')
          console.log(`incoming osc is ${that.incomingMsg}`);
          socket.emit('browser', that.incomingMsg)
        })
      })
    },
  }
}

global.vm = vm;
export default vm;

// console.log(`accessing inner data: ${vm.data().message}`)
</script>

<style lang="scss">
.title {
  color: $primary;
}
</style>
