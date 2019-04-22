<template>
  <v-layout justify-center row class="mt-5"
    wrap v-if="channels.length > 0"
  >
    <v-flex xs10 sm8 md6 lg4 xl3 >
        <v-toolbar color="blueDarker" flat dense>
          <v-toolbar-title>
            Join Channels
          </v-toolbar-title>
        </v-toolbar>
      <div class="grayDark"
      >
      <channel
        v-for="(channel, index) in channels"
        :key="index"
        v-bind:channel="channel"
      />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  import channel from '../components/channels/RemoteChannel'
  // import { mapGetters } from 'vuex'
  export default {
    name: 'joinChannel',
    components: { channel },
    computed: {
      channels () {
      return this.$store.getters['channels/remoteChannels']
    }
    },
    mounted() {
      this.$store.commit('channels/setInitiator', false)
      this.init()
      this.start()
    },
    destroyed () {
      this.stop()
    },
    methods: {
      init () {
        this.$store.dispatch('channels/clear')
      },
      start () {
        this.$store.dispatch('channels/startListener')
      },
      stop () {
        this.$store.dispatch('channels/stopListener')
      },
      remove (title) {
        this.$store.dispatch('channels/deleteChannel', { title })
      }
    },
  }
</script>
