import Vue from 'vue';
import App from './app.vue';

window.VueBus = new Vue();

new Vue({
  el: '#app',
  render: h => h(App)
});
