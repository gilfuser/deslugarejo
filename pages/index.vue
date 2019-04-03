<template>
  <v-layout justify-center row class="mt-5" wrap>
    <v-flex xs10 sm8 md6 lg4 xl3 >
      <div class="grayDark">
    <!-- <signUp /> -->
      <h1 class="title">DESLUGAREJO</h1>
      <h2 class="subtitle">non-local jamming</h2>
        <p>Jam with people using apps capable to communicate through OSC in their machines. Fast and directly from peer to peers thanks to WebRTC.</p>
        <!-- <fa :icon="['fas', 'handshake']"/> -->
        <div class="columns">
          <div class="column">
            <!-- <q-btn>create channel</q-btn> -->
            <!-- <create-channel /> -->
          </div>
          <!-- <div class="column">
            <nuxt-link to="/generators">osc generators</nuxt-link>
          </div> -->
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
// import SignUp from '~/components/SignUp'

export default {
  components: {
    // SignUp
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
