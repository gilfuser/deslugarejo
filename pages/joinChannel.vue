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
      <OthersChannel
        v-for="(channel, index) in channels"
        :key="index"
        v-bind:channel="channel"
      />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  import OthersChannel from '@/components/OthersChannel'
  export default {
    name: 'joinChannel',
    components: { OthersChannel },
    computed: {
      channels() {
        return this.$store.getters.remoteChannels 
      }
    },
  }
</script>

<style scoped>

</style>