import { createRouter, createWebHistory } from 'vue-router'
import DoctorView from '@/views/DoctorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/doctores', // Redirige a doctores al cargar la raíz
    },
    {
      path: '/doctores',
      name: 'doctores',
      component: DoctorView,
      meta: { layout: 'WireframeLayout' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
