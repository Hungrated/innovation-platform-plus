// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import VueRouter from 'vue-router';
import Routers from './routers';
import axios from 'axios';
import App from './App';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import mavonEditor from 'mavon-editor';
import vueCroppa from 'vue-croppa';
import 'vue-croppa/dist/vue-croppa.css';
import './styles/global.css';
import './styles/iview-overwrite-global.css';
import './styles/transition.css';

Vue.use(iView);
Vue.use(VueRouter);
Vue.use(mavonEditor);
Vue.use(vueCroppa);

axios.defaults.withCredentials = true;
Vue.prototype.$ajax = axios;

const router = new VueRouter({
  history: true,
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
