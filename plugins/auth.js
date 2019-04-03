import firebase from '~/plugins/firebase'

// eslint-disable-next-line prettier/prettier
function auth () {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      resolve(user || false)
    })
  })
}
export default auth
