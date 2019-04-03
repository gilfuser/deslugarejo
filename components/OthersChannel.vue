<template>
  <div color="white">
        <v-card
        class="gray4 mt-3 pb-1 pa-3"
        >
          <v-card-title primary-title>
            {{ channel.label }}
          </v-card-title>
          <v-form @submit.prevent="onJoinChannel">
            
          <v-card-text>
            <div>
              <span>initiator: {{ channel.initiator }} </span><br>
              <span>type: {{ channel.type }} </span><br>
              <span>description: {{ channel.description }} </span><br>
              <span>joined in: {{ channel.joinedIn }}</span>

            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" depressed type="submit"
            class="mx-1" @click="onJoinChannel" 
            :disabled="channel.isJoined"
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
    name: 'othersChannel',
    props: { channel: Object },
    methods: {
      onJoinChannel () {
        this.$store.commit('setInitiator', false)
        this.$store.commit('joinChannel', this.channel)
        this.$router.push(`/channels/${this.channel.label}`)
      }
    },
  }
</script>