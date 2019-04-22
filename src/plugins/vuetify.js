import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
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
    },
  options: {
    customProperties: true
  },
  iconfont: 'md'
})
