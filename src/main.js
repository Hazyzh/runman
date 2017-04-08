// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import Vuex from 'vuex'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import * as types from './types'


Vue.use(MintUI)
Vue.use(Vuex)
Vue.use(VueResource)
Vue.use(ElementUI)
Vue.http.options.emulateJSON = true;

Vue.config.productionTip = false


const store = new Vuex.Store({
  state: {
    runid:1,
    runmen:{},
    address:{},
    todayinfo:{},
  },
  mutations: {
      ['settoday']: (state, data) => {
          state.todayinfo = data;
      },
      ['setinfo']: (state, data) => {
          state.runmen = data;
      },
      [types.LOGIN]: (state, data) => {
          localStorage.runtoken = data;
          state.runtoken = data;
      },
      [types.LOGOUT]: (state) => {
          localStorage.removeItem('runtoken');
          state.runtoken = null
      },
  }
})

if (window.localStorage.getItem('runtoken')) {
    store.commit(types.LOGIN, window.localStorage.getItem('runtoken'))
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
