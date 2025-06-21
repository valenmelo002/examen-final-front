import { createRouter, createWebHistory } from 'vue-router'
import DoctorView from '@/views/DoctorView.vue'
import DoctorHorarioView from '@/views/DoctorHorarioView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DoctorView,
      meta: { layout: 'WireframeLayout' },
    },
    {
      path: '/doctores',
      name: 'doctores',
      component: DoctorView,
      meta: { layout: 'WireframeLayout' },
    },
    {
      path: '/horarios',
      name: 'horarios',
      component: DoctorHorarioView,
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
