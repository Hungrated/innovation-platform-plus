// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import VueRouter from 'vue-router';
import Routers from './routers';
import axios from 'axios';
import App from './App';
import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(iView);
Vue.use(VueRouter);

Vue.prototype.$ajax = axios;

const router = new VueRouter({
  mode: 'history',
  routes: Routers
});

/* eslint-disable no-unused-vars */

let vm = new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});

vm.$Message.config({
  top: 50
});

vm.$Notice.config({
  top: 50
});
