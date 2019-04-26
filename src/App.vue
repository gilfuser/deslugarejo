<template>
  <v-app dark>
    <TheNavbar />
    
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

require('electron-cookies');
import TheNavbar from './components/TheNavbar'
import firebase from 'firebase/app'
// import { mapGetters } from 'vuex'
export default {
  name: 'App',
  components: { TheNavbar },
  data() {
    return {
      title: "Deslugarejo",
      user: null
    };
  },
  mounted () {
    let that = this
    firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            let displayName = user.displayName;
            let email = user.email;
            let emailVerified = user.emailVerified;
            let photoURL = user.photoURL;
            let uid = user.uid;
            let phoneNumber = user.phoneNumber;
            let providerData = user.providerData;
            user.getIdToken().then(function(accessToken) {
              that.user = {
                displayName: displayName,
                email: email,
                emailVerified: emailVerified,
                phoneNumber: phoneNumber,
                photoURL: photoURL,
                uid: uid,
                accessToken: accessToken,
                providerData: providerData
              }
            }).then(() => {
              that.sendUser()
            });
          } else {
            // User is signed out.
            that.$store.commit('isSignedIn', false)
            that.$store.dispatch('logOutIn')
            that.$store.commit('user/setUser', null)
            that.$store.commit('setName', null)
          }
        }, function(error) {
          console.log(error);
        });
  },
  methods: {
    sendUser () {
      this.$store.commit('user/setUser', this.user)
      this.$store.commit('isSignedIn', true)
      this.$store.dispatch('logOutIn')
    }
  },
}
</script>
