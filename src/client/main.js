// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import VueRouter from 'vue-router';
import Routers from './routers';
import Axios from 'axios';
import App from './App';
import iView from 'iview';
import MavonEditor from 'mavon-editor';
import VueCroppa from 'vue-croppa';

import 'iview/dist/styles/iview.css';
import 'mavon-editor/dist/css/index.css';
import 'vue-croppa/dist/vue-croppa.css';
import './styles/overwrite-global.css';

Vue.use(iView);
Vue.use(VueRouter);
Vue.use(MavonEditor);
Vue.use(VueCroppa);

Axios.defaults.withCredentials = true;
Vue.prototype.$ajax = Axios;

const router = new VueRouter({
  history: true,
  routes: Routers
});

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
