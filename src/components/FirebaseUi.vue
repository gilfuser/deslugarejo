<template>
<div id="firebaseui-auth-container">
  <!-- {{ user }} -->
  </div>
</template>

<script>
import { auth, authGoogle, authEmail } from '../firebase';
import firebase from 'firebase/app'
// import { mapActions } from 'vuex';
// let anonymousUser = auth.user

export default {
  name: 'Login',
  data() {
    return {
      user: null
    }
  },
  methods: {
    // ...mapActions('user', [ 'login' ]),
    // writeUserData (userId, email) {
      // return firebaseApp.database().ref('users/' + userId).set({
      //   email: email
      // })
    // }
    isSignedIn() {
      this.$store.dispatch('signIn')
    }
  },
  mounted: function () {
    // if (process.browser) {
      let that = this
      let firebaseui = require('firebaseui');
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
      const config = {
        signInOptions: [
          {
            authMethod: 'https://accounts.google.com',
            clientId: process.env.clientId
          },
          authEmail,
          authGoogle,
          firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
        autoUpgradeAnonymousUsers: true,
        signInSuccessUrl: '/',
        tosUrl: '/',
        privacyPolicyUrl: '/',
        callbacks: {
          signInSuccessWithAuthResult: function (/* authResult*/) {
            // let user = authResult.user
            // let credential = authResult.credential;
            // let isNewUser = authResult.additionalUserInfo.isNewUser;
            // let providerId = authResult.additionalUserInfo.providerId;
            // let operationType = authResult.operationType;
            // console.log(user)
            that.isSignedIn()
            // console.log(credential)
            // console.log('is new user: ' + isNewUser)
            // console.log('provider ID: ' + providerId)
            // console.log('operation type: ' + operationType)
            // this.login(user)
            // this.writeUserData(user.uid, user.email)
          },
          // uiShown: function () {
          //   console.log('uiShown');
          // },
          signInFailure: function(error) {
            if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
              return Promise.resolve();
            }
            var cred = error.credential;
            return firebase.auth().signInWithCredential(cred);
          }
        }
      };
        ui.start('#firebaseui-auth-container', config)
      }
    // }
  }
</script>

<style src="../../node_modules/firebaseui/dist/firebaseui.css"></style>