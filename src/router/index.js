import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { getAuth } from 'firebase/auth';

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
            component: () => import('../views/signup.vue'),
            meta: { requiresAuth: false },
    },
    {
      path: '/main',
      name: 'mainpage',
      component: () => import('../views/mainpage.vue'),
      meta: { requiresAuth: true },
         },
    {
      path: '/createaccount',
      name: 'createaccount',
      component: () => import('../views/createaccount.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/errorconnecting',
      name: 'interneterror',
      component: () => import('../components/interneterror.vue')
    }
   ]
})
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (to.meta.requiresAuth && !user) {
    next('/signup'); 
  } else {
    next(); 
  }
});
export default router
