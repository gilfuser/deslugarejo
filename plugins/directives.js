import Vue from 'vue'
// Register a global custom directive called `v-focus`
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  // eslint-disable-next-line prettier/prettier
  inserted: function (el) {
    // Focus the element
    el.focus()
  }
})
