/**
 * Created by 35781 on 2016/11/28.
 */
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const Results = resolve => require(['./views/results.vue'], resolve);
const Settings = resolve => require(['./views/settings.vue'], resolve);
const Try = resolve => require(['./views/try.vue'], resolve);
const Index = resolve => require(['./views/index.vue'], resolve);

export default new Router({
  mode: 'hash',
  routes: [{
    path: '/',
    component: Index
  }, {
    path: '/settings',
    component: Settings
  }, {
    path: '/results',
    component: Results
  }, {
    path: '/try',
    component: Try
  }, {
    path: '*',
    redirect: '/try'
  }]
});
