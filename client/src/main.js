import Vue from 'vue';
import VueRouter from 'vue-router';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import App from './App.vue';
import routes from './routes';
import store from './store/store';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

const router = new VueRouter({
  routes,
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

if (!store.state.user && router.currentRoute.path !== '/login') {
  router.push({ path: '/login' });
}

router.beforeEach((to, from, next) => {
  if (to.matched.some((route) => route.meta.auth)) {
    if (!store.state.user) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});
