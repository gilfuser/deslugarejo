import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'

if (!firebase.apps.length) {
  const config = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId
  }
  firebase.initializeApp(config)
  // firebase.firestore().settings({ timestampsInSnapshots: true })
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
