<template>
  <v-app id="layout" dark fluid>
    <TheNavbar />
    <nuxt />
  </v-app>
</template>

<script>
import TheNavbar from "@/components/TheNavbar";
import { mapState } from "vuex";
import firebase from 'firebase/app'
export default {
  components: { TheNavbar },
  data() {
    return {
      title: "Deslugarejo",
      user: null
    };
  },
  computed: {
    // userAuthenticated() {
    //   return (!!this.$store.state.signedIn )
    // },
    channelCreated () {
      return this.$store.state.createdChannel.label
    }
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
              that.$store.commit('signOut', true)
              that.$store.commit('setUser', null)
          }
        }, function(error) {
          console.log(error);
        });
  },
  methods: {
    sendUser () {
      this.$store.dispatch('signIn', this.user)
    }
  },
};
</script>
