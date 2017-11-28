// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import VueRouter from 'vue-router';
import Routers from './routers';
import VueResource from 'vue-resource';
import App from './App';
import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(iView);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.config.productionTip = false;

const router = new VueRouter({
  mode: 'history',
  routes: Routers
});

let vm = new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
