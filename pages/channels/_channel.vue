<template>
  <v-layout justify-center row class="mt-5">
    <v-flex xs10 sm8 md6 lg4 xl3>
      <div class="gray4">
        <v-card class="gray4 pb-3">
          <v-toolbar color="blueDarker" flat dense>
            <v-toolbar-title class="card-title">{{ channel.label }}</v-toolbar-title>
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
            @submit.prevent="setOscClient"
          >
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
              <!-- <v-btn color="primary" block depressed @click.prevent="createSwarm">connect it</v-btn>
              <v-spacer/> -->
              <v-btn color="primary" type="submit" block depressed>set osc client</v-btn>
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
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import socket from '~/plugins/socket.io.js'
// import { mapGetters } from 'vuex';

export default {
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
    msgOutPath: undefined
    // msgOutValue: undefined,
    // msgInAddr: undefined,
    // msgInValue: undefined
  }),
  computed: {
    // ...mapGetters({
      channel() {
        return this.$store.getters.loadChannel( this.$route.params.channel)
      }
      // channel: 'channels/loadChannel'// 
    // })
    // },
    // msgOut: {
    //   get: function() {
    //     // return this.msgOutAddr + ' ' + this.msgOutValue
    //     return this.msgOutPath //.join(', ')
    //   },
    //   set: function(newValue) {
    //     // let that = this
    //     // let msgKeyVal = newValue.toString().split(',')
    //     this.msgOutPath = newValue // msgKeyVal[0]
    //     // this.msgOutValue = msgKeyVal[msgKeyVal.length - 1]
    //   }
    // }
    //   msgIn: {
    //     get: function () {
    //       return this.msgInAddr + ' ' + this.msgInValue
    //     },
    //     set: function (newValue) {
    //       let msgKeyVal = newValue.split(',')
    //       this.msgInAddr = msgKeyVal[0]
    //       this.msgInValue = msgKeyVal[msgKeyVal.length - 1]
    //     }
    //   },
  },
  methods: {
    setOscClient() {
      this.$store.commit('oscClientHost', this.oscClientHost)
      this.$store.commit('oscClientPort', this.oscClientPort)
      socket.emit('config', {
        server: { port: this.socketPortIn, host: '127.0.0.1' },
        client: { host: this.oscClientHost, port: this.oscClientPort }
      })
    },
    createSwarm() {
      this.swarm = this.$mySwarm(
        this.channel.label,
        this.channel.initiator,
        this.channel.uuid
      )
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.createSwarm()
    })
  },
  watch: {
    swarm: function(swarm) {
      let that = this
      swarm.on('connect', function(peer, id) {
        console.log('connected with peer id: ' + id)
        that.connected = true
        peer.on('data', function(data) {
          socket.emit('incoming', data)
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
    let that = this
    socket.on('outgoing', function(msg) {

          const tempMsgOut = msg
          console.log('data length', msg.length)
          console.log(typeof msg)
          for (let i = 0; i < tempMsgOut.length; i++) {
            if (isNaN(tempMsgOut[i])) {
              that.msgOut.splice(i, 1, tempMsgOut[i])
            } else {
              if (tempMsgOut[i].length > 1) {
                that.msgOut.splice(i, 1, parseFloat(tempMsgOut[i]).toFixed(3))
              } else {
                that.msgOut.splice(i, 1, parseInt(tempMsgOut[i]))
              }
            }
          }
      if (that.connected) {
        that.swarm.peers.forEach(function(peer, uuid) {
          peer.send(msg)
          console.log('msg to peer', uuid)
          console.log(that.swarm.peers)
        })
      }
    })
  }
}
</script>

<style scoped>
</style>