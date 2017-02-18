import Vue from 'vue';
import App from './app.vue';
require('./directives');
require('./extenders');

window.VueBus = new Vue();

new Vue({
  el: '#app',
  render: h => h(App)
});
