import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Maxhome from '@/views/Maxhome.vue'
import user from '@/views/user/user.vue'
import Rights from '@/views/rights/rights.vue'
import Role from '@/views/rights/role.vue'
import Goods from '@/views/goods/goods.vue'
import List from '@/views/goods/list.vue'
import Add from '@/views/goods/add.vue'
Vue.use(VueRouter)
export default new VueRouter({
  mode: 'history',
  routes: [
    //   添加重定向
    {
      name: 'default',
      path: '/',
      redirect: {
        name: 'Login'
      }
    },
    {
      name: 'default',
      path: '/goods',
      redirect: {
        name: 'Goods'
      }
    },
    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    {
      name: 'Home',
      path: '/home',
      component: Home,
      redirect: {
        name: 'Maxhome'
      },
      children: [{
        name: 'Maxhome',
        path: 'maxhome',
        component: Maxhome
      },
      {
        name: 'User',
        path: 'users',
        component: user
      },
      {
        name: 'Rights',
        path: 'rights',
        component: Rights
      },
      {
        name: 'Role',
        path: 'roles',
        component: Role
      },
      {
        name: 'Goods',
        path: 'goods',
        component: Goods,
        redirect: {
          name: 'List'
        },
        children: [{
          name: 'List',
          path: 'list',
          component: List
        },
        {
          name: 'Add',
          path: 'add',
          component: Add
        }
        ]
      }
      ]
    }
  ]
})
