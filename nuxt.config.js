/* eslint-disable prettier/prettier */
/* eslint-disable nuxt/no-cjs-in-config */
// eslint-disable-next-line no-unused-vars
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const pkg = require('./package')

module.exports = {
  mode: 'spa',

  head: {
    title: pkg.name
    // meta: [
    //   { charset: 'utf-8' },
    //   { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    //   { hid: 'description', name: 'description', content: pkg.description }
    // ],
    // link: [
    //   { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    //   {
    //     rel: 'stylesheet',
    //     href:
    //       'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
    //   }
    // ]
  },

  loading: { color: '#fe8019' },

  css: [
    '~/assets/style/app.styl',
    // '~/assets/css/global.css',
    // { src: '~assets/main.scss', lang: 'scss' },
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  plugins: [
    '~/plugins/fontawesome.js',
    '~/plugins/moment.js',
    '~/plugins/firebase.js',
    { src: '~/plugins/swarm.js', ssr: false }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // '@nuxtjs/pwa',
    // '@nuxtjs/dotenv',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  vuetify: {
    // Vuetify options
    theme: {
      primary: '#fe8019',
      secondary: '#d79921',
      accent: '#8ec07c',
      red: '#cc241d',
      warning: '#fabd2f',
      info: '#b8bb26',
      success: '#8ec07c',
      white: '#f3efde',
      ocre: '#ebdbb2',
      yellow: '#fabd2f',
      yellowDark: '#d79921',
      greyDark: '#504945',
      greyDarkInv: '#bdae93',
      greyDarker: '#282828',
      gray: '#928374',
      gray3: '#7c6f64',
      gray4: '#665c54',
      blueLight: '#83a598',
      blue: '#458588',
      blueDark: '#336366',
      blueDarker: '#2b5355',
      orange: '#fe8019',
      orangeDark: '#d65d0e',
      redLight: '#fb4934',
      redLighter: '#fc7869',
      redDark: '#b31f19',
      brown: '#861713',
      brownDark: '#701310',
      error: '#fabd2f'
    }
  },

  /*
   ** Build configuration
   */
  build: {
    // transpile: ['vuetify/lib'],
    // plugins: [new VuetifyLoaderPlugin()],
    // loaders: {
    //   stylus: {
    //     import: ['~assets/style/variables.styl']
    //   }
    // },
    /*
     ** You can extend webpack config here
     */
    // eslint-disable-next-line prettier/prettier
    extend (config, { isDev }) {
      if (isDev && process.client) {
        // Run ESLint on save
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })(config.resolve.alias['@fortawesome/fontawesome-free-brands$'] =
        '@fortawesome/fontawesome-free-brands/shakable.es.js')
        config.resolve.alias['@fortawesome/fontawesome-free-solid$'] = '@fortawesome/fontawesome-free-solid/shakable.es.js'
      }
      // Extend only webpack config for client-bundle
      if (process.client) {
        config.target = 'electron-renderer'
      }
    }
  },

  dev: process.env.NODE_ENV === 'DEV',

  env: {
    apiKey: 'AIzaSyD4uQGKCqb0yQGSnRrLIIgp1KsMC4EDtK4',
    authDomain: 'deslugarejo-db.firebaseapp.com',
    databaseURL: 'https://deslugarejo-db.firebaseio.com',
    projectId: 'deslugarejo-db',
    storageBucket: 'deslugarejo-db.appspot.com',
    messagingSenderId: '956505351808',
    WS_URL: process.env.WS_URL || 'http://localhost:3000'
  }
}
