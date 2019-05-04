import signalhub from 'signalhub'
import createSwarm from 'webrtc-swarm'
import wrtc from 'wrtc'

export const swarm = {
  mounted() {
  },
  data() {
    return {
      swarm: null,
      peers: [],
      initiator: true,
      label: 'deslugarejo',
    }
  },
  computed: {
    uuid: function () {
      // return 'asdasdasd'
        return Math.floor(Math.random() * 1000000000)
    }
    // randomNumber : function(){
    // },
  },
  methods: {
    createMySwarm() {
      this.swarm = createSwarm(
        signalhub(this.label, ['https://serversignaling.herokuapp.com/']),
        {
          initiator: this.initiator,
          wrtc,
          // objectMode: true,
          uuid: this.uuid,
          trikle: false,
          channelConfig: {
            label: this.label,
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
  created() {
    // this.uuid = 'test' //Math.floor(Math.random() * 1000000000)
    this.createMySwarm()
    
  },
  watch: {
    swarm: function(swarm) {
      let that = this
      swarm.on('connect', function(peer, id) {
        console.log('connected with peer id: ' + id)
        // that.connected = true
          swarm.peers.forEach(function(peer, uuid) {
            peer.send('Hallo')
            console.log('msg to peer: ', uuid, ' peers: ', swarm.peers)
          })
          peer.on('data', function(data) {
          console.log('data: ', data);
          // const tempMsgIn = data
          //   .toString()
          //   .replace(/,/g, ', ')
          //   .split(', ')
          // for (let i = 0; i < tempMsgIn.length; i++) {
          //   if (isNaN(tempMsgIn[i])) {
          //     that.msgIn.splice(i, 1, tempMsgIn[i])
          //   } else {
          //     if (tempMsgIn[i].length > 1) {
          //       that.msgIn.splice(i, 1, parseFloat(tempMsgIn[i]).toFixed(3))
          //     } else {
          //       that.msgIn.splice(i, 1, parseInt(tempMsgIn[i]))
          //     }
          //   }
          // }
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
