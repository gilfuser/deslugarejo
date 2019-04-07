<template>
  <div id="firebaseui-auth-container"/>
</template>

<script>
import { auth, authGoogle, authEmail, firebase } from '~/plugins/firebase';
let anonymousUser = auth.user

export default {
  name: 'Login',
  mounted: function () {
    if (process.browser) {
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
        // signInSuccessUrl: '/',
        // tosUrl: '/',
        // privacyPolicyUrl: '/',
        callbacks: {
          // signInSuccessWithAuthResult: function () {
          //   alert('You\'re in')
          // },
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
      // if (ui.isPendingRedirect()) {
        ui.start('#firebaseui-auth-container', config)
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
              // console.log('poing!');
              this.$store.dispatch('signUserUp', user)
                this.$router.push('/')
            }
        //     // } else {
        //     // }
        })
      // }
    }
  }
}
</script>

<style src="~/node_modules/firebaseui/dist/firebaseui.css"></style>