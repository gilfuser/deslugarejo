<template>
  <div>
I'm an OSC Generator! {{ $route.params.gens }}
  </div>
</template>

<script>
  export default {
    props: ['swarm', 'socket'],
    data() {
      return {
        key: value
      }
    },
    methods: {
      submitMsg () {
        let that = this
        // this.oscMsg = []
        this.oscMsg = [ this.address, this.message ]
        socket.emit('incoming', this.oscMsg)
        if (that.connected) {
          this.swarm.peers.forEach((peer) => {
            peer.send(this.oscMsg)
          })
        }
      },
    },
    
  }
</script>

<style scoped>

</style>