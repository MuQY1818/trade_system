import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/Register.vue')
    },
    {
      path: '/',
      name: 'layout',
      component: () => import('../layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/Home.vue')
        },
        {
          path: 'suppliers',
          name: 'suppliers',
          component: () => import('../views/supplier/SupplierList.vue')
        },
        {
          path: 'suppliers/create',
          name: 'supplier-create',
          component: () => import('../views/supplier/SupplierForm.vue')
        },
        {
          path: 'suppliers/:id',
          name: 'supplier-edit',
          component: () => import('../views/supplier/SupplierForm.vue')
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    // 如果需要登录且没有token，重定向到登录页
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && token) {
    // 如果已登录且访问登录/注册页，重定向到首页
    next('/')
  } else {
    next()
  }
})

export default router 