import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import authGuard from '/src/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signup',
      name: 'signup',
            component: () => import('../views/signup.vue')
    },
    {
      path: '/main',
      name: 'mainpage',
      component: () => import('../views/mainpage.vue'),
         },
    {
      path: '/createaccount',
      name: 'createaccount',
      component: () => import('../views/createaccount.vue')
    },
    {
      path: '/errorconnecting',
      name: 'interneterror',
      component: () => import('../components/interneterror.vue')
    }
   ]
})

export default router
