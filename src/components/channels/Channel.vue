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
            <v-text-field
              id="remote-address"
              prepend-icon="radio"
              name="remote-address"
              label="remote address"
              type="text"
              required
              v-model="remoteAddress"
            ></v-text-field>
            <v-text-field
              id="remote-port"
              prepend-icon="radio"
              name="remote-port"
              label="remote port"
              required
              type="text"
              v-model.number="remotePort"
            ></v-text-field>
            <v-card-actions>
              <!-- type="submit" -->
              <v-layout row wrap>
              <v-btn color="primary"
              @click="setOscComm"
              block depressed>
              set osc
              </v-btn>
              <v-btn color="primary"
              @click="sendIn"
              block depressed>
              send
              </v-btn>
              <v-btn color="primary"
              @click="$store.commit('osc/clear')"
              block depressed>
              clear
              </v-btn>
              <v-btn color="primary"
              @click="createSwarm"
              block depressed>
              swarm
              </v-btn>
              </v-layout>
            </v-card-actions>
          </v-form>
          <v-form min-width="250px" class="mx-4" style="margin-top:20px">
            <div style="margin-bottom:10px">Outgoing Messages</div>
            <v-layout row wrap>
              <v-text-field
                :value="msgOut !== undefined ? msgOut.address : ''"
                label="address"
                readonly
              ></v-text-field>
              <v-text-field
              :value="msgOut !== undefined ? msgOut.args : ''"
              label="arguments"
              readonly>
              </v-text-field>
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
import signalhub from 'signalhub'
import createSwarm from 'webrtc-swarm'
import wrtc from 'wrtc'

export default {
  data: () => ({
    show: false,
    swarm: null,
    connected: false,
    localAddress: '0.0.0.0',
    localPort: 7400,
    remoteAddress: '127.0.0.1',
    remotePort: 57120,
    msgIn: [],
    peers: [],
    ipAdresses: null
  }),
  computed: {
    channel() {
      return this.$store.getters['channels/loadChannel'](this.$route.params.id)
    },
    msgOut() {
        const msgOut = this.$store.getters['osc/msgOut'](this.$route.params.id)
        if (this.swarm) {
          this.swarm.peers.forEach(function(peer, uuid) {
            peer.send(oscMessage)
            console.log('oscMessage to peer', uuid)
            console.log(that.swarm.peers)
          })
        }
        return msgOut
    }
  },
  methods: {
    setOscComm() {
      this.$store.dispatch('osc/createOscPort', {
        title: this.$route.params.id,
        remoteAddress: this.remoteAddress,
        remotePort: this.remotePort
      })
    },
    sendIn() {
      this.$store.dispatch('osc/msgIn', {
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
        initiator: this.$store.getters['channels/initiator'],
        wrtc,
        uuid: this.$store.state.name,
        trikle: false,
        channelConfig: {
          label: this.$route.params.id,
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
  },
  mounted() {
    // // this.createOscPort()
    // this.$nextTick(() => {
    // })
  },
  watch: {
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
}
</script>

<style scoped>
</style>