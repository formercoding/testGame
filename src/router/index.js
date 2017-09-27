import Vue from 'vue'
import Router from 'vue-router'
import Edit from '@/components/setgame'
import List from '@/components/list'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/edit/:eventId',
      name: 'edit',
      component: Edit
    }, {
      path: '/list',
      name: 'list',
      component: List
    }, {
      path: '/edit',
      redirect: '/edit/new'
    }, {
        path: '/',
        redirect: '/list'
    }
  ]
})