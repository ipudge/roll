import Vue from 'vue';
import App from './App.vue';
import router from './routers';
import filters from './filters';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

Vue.use(ElementUI);
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

const app = new Vue({
  router,
  ...App
});

app.$mount('#app');
