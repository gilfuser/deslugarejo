<template>
    <div class="mb-5">
  <!-- 
    <v-navigation-drawer
      class="hidden-sm-and-up"
      v-model="drawer"
      color="primary"
      app
    >
      <v-list>
        <v-list-tile
        router
        :to="item.to"
        :key="i"
        v-for="(item, i) in menuItems"
        exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title">
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      </v-navigation-drawer> -->
    <v-toolbar
      app fixed clipped-left flat color="blue" dense
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"
        class="hidden-sm-and-up hidden-xl">
      </v-toolbar-side-icon>
    <v-avatar
      size="32"
      color="red"
      class="hidden-xs-only"
    >
      <img src="@/assets/icons/png/32x32.png" alt="deslugar">
    </v-avatar>
    <v-toolbar-title class="white--text hidden-xs-only">
    </v-toolbar-title>
    <v-toolbar-items>
    <!-- 
      -->
      <v-menu 
      offset-y
      v-if="createdChannels.length > 0"
      >
        <template v-slot:activator="{ on }"
        color="primary"
        >
          <v-btn flat v-on="on">
            Created Channels
          </v-btn>
        </template>
        <v-list 
        >
          <v-list-tile
          v-for="(item, index) in createdChannels"
          :key="index"
          exact
          router
          :to="item.to"
          @click="setInitTrue"
          >
            <v-list-tile-title dense>
              {{ item.title }}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-menu 
      offset-y
      v-if="joinedChannels.length > 0"
      >
        <template v-slot:activator="{ on }"
        color="primary"
        >
          <v-btn flat v-on="on">
            Joined Channels
          </v-btn>
        </template>
        <v-list>
          <v-list-tile
          v-for="(item, index) in joinedChannels"
          :key="index"
          exact
          router
          :to="`/channels/${item.title}`"
          @click="setInitFalse"
          >
            <v-list-tile-title dense>
              {{ item.title }}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
      <v-spacer></v-spacer> 
        <v-toolbar-items>
          <v-btn flat 
          class="hidden-xs-only"
          v-for="(item, i) in menuItems"
          :key="i"
          exact
          router
          :to="item.to"
          >
            {{ item.title }}
          </v-btn>
        <v-list>
          <v-list-tile
          v-for="(item, index) in logOutIn"
          :key="index"
          @click="logInOut(item.title)"
          >
            <v-list-tile-title dense>
              {{ item.title }}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar-items> 
    </v-toolbar> 
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import firebase from 'firebase/app'

export default {
  name: 'theNavBar',
  data: () => ({
    drawer: false,
  }),
  computed: {
    ...mapGetters({
      menuItems: 'menuItems',
      logOutIn: 'logOutIn',
      // createdChannels: 'createdChannels',
      // joinedChannels: 'joinedChannels',
    }),
    createdChannels () {
      return this.$store.getters['channels/createdChannels']
    },
    joinedChannels () {
      return this.$store.getters['channels/joinedChannels']
    }
  },
  methods: {
    setInitTrue () {
      this.$store.commit('channels/setInitiator', true)
    },
    setInitFalse () {
      this.$store.commit('channels/setInitiator', false)
    },
    logInOut (title) {
      if (title === 'Log Out') {
        firebase.auth().signOut().then(() => {
          this.$store.commit('user/setUser', null)
          this.$store.commit('setName', null)
          this.$store.commit('isSignedIn', false)
          this.$store.dispatch('logOutIn')
          this.$router.replace('/')
        })
      }
    }
  },
};
</script>

<style scoped>
</style>