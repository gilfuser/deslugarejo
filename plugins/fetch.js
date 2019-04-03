import auth from '~/plugins/auth'

// eslint-disable-next-line prettier/prettier
export default async function ({ store }) {
  if (process.browser) {
    // eslint-disable-next-line no-undef
    alert(1)
    let user
    try {
      user = await auth()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
    await store.dispatch('SET_CREDENTIAL', { user: user || null })
    await store.dispatch('INIT_POSTS')
  }
}
