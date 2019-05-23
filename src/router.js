// Copyright (C) 2019 Digitalents Helsinki

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () =>
        import(/* webpackChunkName: "control" */ './views/Control.vue')
    }
  ]
})
