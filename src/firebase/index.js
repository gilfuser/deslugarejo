import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import envars from '../../envars'

let config = {}

if (!firebase.apps.length) {
  config = {
    apiKey: envars.apiKey,
    authDomain: envars.authDomain,
    databaseURL: envars.databaseURL,
    projectId: envars.projectId,
    storageBucket: envars.storageBucket,
    messagingSenderId: envars.messagingSenderId,
    clientId: envars.clientId
  }
  firebase.initializeApp(config)
}
const authEmail = {
  provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
  requireDisplayName: false
  // signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
}
const authGoogle = { provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID }
// const authAnon = { provider: firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID }
// const authFB = { provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID }
const auth = firebase.auth()
const db = firebase.database()
const fireDb = firebase.firestore()
export { fireDb, authGoogle, authEmail, auth, db }
