import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: Home
		},
		{
			path: '/report_cs_scsv',
			component: () => import('../views/Report_CS_SCSV.vue')
		},
		{
			path: '/report_qt_portal',
			component: () => import('../views/Report_QT_Poratal.vue')
		},
		{
			path: '/report_am',
			component: () => import('../views/report_am.vue')
		},
		{
			path: '/report_ou',
			component: () => import('../views/report_ou.vue')
		},
		{
			path: '/report_cs_jv',
			component: () => import('../views/Report_CS-JV.vue')
		},
	],
})

export default router