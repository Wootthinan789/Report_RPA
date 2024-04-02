import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/Dev-RPA/'
    },
    {
      path: '/Dev-RPA',
      component: Home
    },
    {
      path: '/Dev-RPA/report_cs_scsv',
      component: () => import('../views/Report_CS_SCSV.vue')
    },
    {
      path: '/Dev-RPA/report_qt_portal',
      component: () => import('../views/Report_QT_Poratal.vue')
    },
    {
      path: '/Dev-RPA/report_am',
      component: () => import('../views/report_am.vue')
    },
    {
      path: '/Dev-RPA/report_ou',
      component: () => import('../views/report_ou.vue')
    },
    {
      path: '/Dev-RPA/report_aek',
      component: () => import('../views/Report_aek.vue')
    },
    {
      path: '/Dev-RPA/report_cs_jv',
      component: () => import('../views/Report_CS-JV.vue')
    },
  ],
})

export default router