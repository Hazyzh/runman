import Vue from 'vue'
import Router from 'vue-router'

import rmhome from '@/views/rmhome'
import runmeninfo from '@/views/runmeninfo'
import usermap from '@/views/usermap'
import ordermap from '@/views/ordermap'
import runordermap from '@/views/runordermap'
import orderlist from '@/views/orderlist'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'rmhome',
      component: rmhome
    },
    {
      path: '/runmeninfo',
      name: 'runmeninfo',
      component: runmeninfo
    },
    {
      path: '/usermap',
      name: 'usermap',
      component: usermap
    },
    {
      path: '/ordermap/:id',
      name: 'ordermap',
      component: ordermap
    },
    {
      path: '/runordermap/:id',
      name: 'runordermap',
      component: runordermap
    },
    {
      path: '/orderlist',
      name: 'orderlist',
      component: orderlist
    }
  ]
})
