<template>
  <v-layout justify-center row class="mt-5"
    wrap v-if="remoteChannels.length > 0"
  >
    <v-flex xs10 sm8 md6 lg4 xl3 >
        <v-toolbar color="blueDarker" flat dense>
          <v-toolbar-title>
            Join Channels
          </v-toolbar-title>
        </v-toolbar>
      <div class="grayDark"
      >
      <OthersChannel
        v-for="(channel, index) in remoteChannels"
        :key="index"
        v-bind:channel="channel"
      />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  import OthersChannel from '@/components/OthersChannel'
  import { mapGetters } from 'vuex'
  export default {
    name: 'joinChannel',
    components: { OthersChannel },
    computed: {
      ...mapGetters({
        remoteChannels: 'remoteChannels'
      })
    },
    mounted() {
      this.init()
      this.start()
    },
    destroyed () {
      this.stop()
    },
    methods: {
      init () {
        this.$store.dispatch('clear')
      },
      start () {
        this.$store.dispatch('startListener')
      },
      stop () {
        this.$store.dispatch('stopListener')
      },
      remove (title) {
        this.$store.dispatch('deleteChannel', { title })
      }
    },
  }
</script>
