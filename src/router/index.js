import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
      path: '/main/goals',
      name: 'Goalpage',
      component: () => import('../views/goalpage.vue'),
    },
    {
      path: '/main/userprofile',
      name: 'UserProfile',
      component: () => import('../views/userprofile.vue'),
    },
    {
      path: '/errorconnecting',
      name: 'interneterror',
      component: () => import('../components/interneterror.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (to.meta.requiresAuth && !user) {
    next('/signup');
  } else if (to.name === 'signup' && user) {
    next('/main');
  } else {
    next();
  }
});

export default router;