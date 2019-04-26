<template>
  <div color="white">
        <v-card
        class="gray4 mt-3 pb-1 pa-3"
        >
          <v-card-title primary-title>
            {{ channel.title }}
          </v-card-title>
          <v-form @submit.prevent="onJoinChannel">
            
          <v-card-text>
            <div>
              <span>initiator: {{ channel.uuid }} </span><br>
              <span>type: {{ channel.type }} </span><br>
              <span>description: {{ channel.description }} </span><br>
              <span>joined in: {{ channel.joinedIn }}</span><br>
              <span>Released at: {{ channel.releasedAt }}</span>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" depressed type="submit"
            class="mx-1" 
            :disabled="isJoined"
            >
              Join Channel
            </v-btn>
          </v-card-actions>
          </v-form>
        </v-card>
  </div>
</template>

<script>
  export default {
    name: 'remoteChannel',
    props: { channel: Object },
    computed: {
      isJoined() {
        let remoteChannels = this.$store.getters['channels/remoteChannels']
        let index = remoteChannels.findIndex(channel => channel.title === this.channel.title)
        if (index !== -1) {
          return remoteChannels[index].joinedIn.includes(this.$store.getters.name)
        } else {
          return false
        }
      }
    },
    methods: {
      onJoinChannel () {
        // this.$store.commit('channels/setInitiator', false)
        // this.$store.commit('channels/joinChannel', this.channel)
        this.$store.dispatch('channels/joinIn', this.channel)
        // console.log('this channel is joined: ', this.channel.isJoined)
        // this.$router.push(this.channel.to)
      }
    },
  }
</script>