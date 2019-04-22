<template>
  <v-layout justify-center row class="mt-5">
    <v-flex xs10 sm8 md6 lg4 xl3>
      <div class="gray4">
        <v-card class="gray4 pb-3">
          <v-toolbar color="blueDarker" flat dense>
            <v-toolbar-title class="card-title">{{ channel.title }}</v-toolbar-title>
            <v-spacer/>
            <v-card-actions>
              <v-btn icon @click="show = !show">
                <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
              </v-btn>
            </v-card-actions>
          </v-toolbar>
          <v-card flat>
            <v-card-text v-show="show">
              <span>Initiator: {{ channel.initiator }}</span>
              <v-spacer/>
              <span>Type: {{ channel.type }}</span>
              <v-spacer/>
              <span>Date: {{ channel.date }}</span>
              <v-spacer/>
              {{ channel.description }}
              <v-spacer/>
              <span>
                Joined in:
                {{ channel.joinedIn }}
              </span>
            </v-card-text>
          </v-card>
          <v-form
            min-width="250px"
            class="mx-4"
            style="margin-top:20px"
          >
            <!-- @submit.prevent="setOscClient" -->
            <!-- @keyup.enter="$store.commit('oscClientHost', $event.target.value)" -->
            <v-text-field
              id="osc-client-host"
              prepend-icon="radio"
              name="osc-client-host"
              label="OSC Client Host"
              type="text"
              required
              v-model="oscClientHost"
            ></v-text-field>
            <v-text-field
              id="osc-client-port"
              prepend-icon="radio"
              name="osc-client-port"
              label="OSC Client Port"
              required
              type="text"
              v-model.number="oscClientPort"
            ></v-text-field>
            <v-card-actions>
              <!-- type="submit" -->
              <v-btn color="primary"
              @click="setOscClient"
              block depressed>
              set osc client
              </v-btn>
              <v-btn color="primary"
              @click="open"
              block depressed>
              open
              </v-btn>
              <v-btn color="primary"
              @click="send"
              block depressed>
              send
              </v-btn>
              <v-btn color="primary"
              @click="$store.commit('osc/clear')"
              block depressed>
              clear
              </v-btn>
              <!-- @click.prevent="setOscClient" -->
            </v-card-actions>
          </v-form>
          <v-form min-width="250px" class="mx-4" style="margin-top:20px">
            <div style="margin-bottom:10px">Outgoing Messages</div>
            <v-layout row wrap>
              <!-- <v-text-field
                :value="msgOutAddr"
                label="address"
                readonly
              ></v-text-field>-->
              <v-text-field :value="msgOut" label="message out" readonly></v-text-field>
            </v-layout>
            <div style="margin-bottom:10px"
              v-for="(peer, i) in peers" :key="i"
            >
            <p>Incoming Message from peer {{ peer }} </p>
            <v-layout row wrap>
              <p v-for="(item, index) in msgIn" :key="index">{{ item }} , &nbsp;</p>
            </v-layout>
            </div>
          </v-form>
        </v-card>
        {{ oscPort }}
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
// const osc = require('osc')
import signalhub from 'signalhub'
import createSwarm from 'webrtc-swarm'
// import wrtc from 'wrtc'
// import oscPort from '../../osc'

export default {
  components: {
    // oscStuff
  },
  data: () => ({
    show: false,
    swarm: undefined,
    connected: false,
    socketPortIn: 3333,
    oscClientPort: 57120,
    oscClientHost: '127.0.0.1',
    msgIn: [],
    peers: [],
    msgOut: [],
    msgOutPath: undefined,
    // oscPort: null,
    oscPortIsOpen: false,
    ipAdresses: null
    // msgOutValue: undefined,
    // msgInAddr: undefined,
    // msgInValue: undefined
  }),
  computed: {
    channel() {
      return this.$store.getters['channels/loadChannel'](this.$route.params.id)
    },
    oscPort() {
      return this.$store.getters['osc/oscPort'](this.$route.params.id)
    }
  },
  methods: {
    //   // let message = new osc.Message('/test/random', ;
    //   // osc.send(message);
    // },
    setOscClient() {
      this.$store.commit('osc/setRemoteAddress', this.oscClientHost)
      this.$store.commit('osc/add', this.channel)
      this.$store.dispatch('osc/createOscPort',  this.$route.params.id)
      this.$store.commit('osc/setRemotePort',  this.oscClientPort)
    },
    open() {
      this.$store.dispatch('osc/openOscPort',  this.$route.params.id)
    },
    send() {
      this.$store.dispatch('osc/sendMsg', {
        title: this.$route.params.id,
        msg: {
          address: "/carrier/frequency",
          args: [
            {
              type: "f",
              value: Math.random()
            }
          ]
        }
      });
    },
    createSwarm() {
      this.swarm = createSwarm(
      signalhub(this.channel.title, ['https://serversignaling.herokuapp.com/']),
      {
        initiator: this.channel.initiator,
        // wrtc,
        uuid: this.channel.uuid,
        trikle: false,
        channelConfig: {
          label: this.channel.title,
          reliable: false,
          maxRetransmits: 0,
          ordered: false
      // TODO: Put the id in a data bank together with uuid
      // {uuid: zezé, id:123456} and fetch the label when a peer join a channel
      // options: { id: 123456 }
        }
      }
    )
    },
    // createOscPort() {
    //   if (!this.oscPort)
    //   this.oscPort = new osc.UDPPort({
    //     localAddress: "0.0.0.0",
    //     localPort: 7400,
    //     remoteAddress: this.$store.getters['osc/remoteAddress'],
    //     remotePort: this.$store.getters['osc/remotePort']
    //   })
    // }
  },
  mounted() {
    // // this.createOscPort()
    // this.$store.dispatch['osc/setIpAddress']
    // this.$nextTick(() => {
    //   // if (!this.oscPortIsOpen) {
    //   //   this.oscPort.open()
    //   //   this.oscPortIsOpen = true
    //   // }
    //   this.createSwarm()
    // })
  },
  watch: {
    oscPort: function (oscPort) {
      const that = this
    // oscPort.on("ready", function () {
      // var ipAddresses = getIPAddresses();
      // console.log("Listening for OSC over UDP.");
      // this.$store.getters['osc/ipAddresses'].forEach(function (address) {
      //   console.log(" Host:", address + ", Port:", oscPort.options.localPort);
      // });
      // console.log("Broadcasting OSC over UDP to", oscPort.options.remoteAddress + ", Port:", oscPort.options.remotePort);
      oscPort.on('message', function (oscMessage) {
        // (message).text(JSON.stringify(oscMessage, undefined, 2));
        console.log('message: ', oscMessage);
          let msgLength = Object.entries(oscMessage).length
          // console.log(typeof oscMessage)
          const tempMsgOut = Object.entries(oscMessage)
          for (let i = 0; i < msgLength; i++) {
            if (isNaN(tempMsgOut[i])) {
              that.msgOut.splice(i, 1, tempMsgOut[i])
            } else {
              if (tempMsgOut[i].length > 1) {
                that.msgOut.splice(i, 1, parseFloat(tempMsgOut[i]).toFixed(3))
              } else {
                that.msgOut.splice(i, 1, parseInt(tempMsgOut[i]))
              }
            }
          console.log('msg out at ', i, ': ', that.msgOut);
          }
          
      if (that.connected) {
        that.swarm.peers.forEach(function(peer, uuid) {
          peer.send(oscMessage)
          console.log('oscMessage to peer', uuid)
          console.log(that.swarm.peers)
        })
      }
      });
    // });
    },
    swarm: function(swarm) {
      let that = this
      swarm.on('connect', function(peer, id) {
        console.log('connected with peer id: ' + id)
        that.connected = true
        peer.on('data', function(data) {
          // socket.emit('incoming', data)
          const tempMsgIn = data
            .toString()
            .replace(/,/g, ', ')
            .split(', ')
          for (let i = 0; i < tempMsgIn.length; i++) {
            if (isNaN(tempMsgIn[i])) {
              that.msgIn.splice(i, 1, tempMsgIn[i])
            } else {
              if (tempMsgIn[i].length > 1) {
                that.msgIn.splice(i, 1, parseFloat(tempMsgIn[i]).toFixed(3))
              } else {
                that.msgIn.splice(i, 1, parseInt(tempMsgIn[i]))
              }
            }
          }
          // that.oscPort.send(that.msgIn)
          that.peers.indexOf(id) === -1 ? that.peers.unshift(id) : ''
        })
      })
      swarm.on('disconnect', function(peer, id) {
        console.log('disconnected from a peer:', id)
        console.log('total peers:', swarm.peers.length)
      })
    }
  },
  beforeMount() {
  }
}
</script>

<style scoped>
</style>