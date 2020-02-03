// Copyright (C) 2019 Digitalents Helsinki

import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Control from './views/Control'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/(sv|en)?',
      name: 'home',
      component: Home
    },
    {
      path: '/admin',
      name: 'admin',
      component: Control
    }
  ]
})
