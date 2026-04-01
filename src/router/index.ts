import HomePage from '@/components/HomePage.vue'
import InitialPage from '@/components/InitialPage.vue'
import PersonalPage from '@/components/PersonalPage.vue'
import RegisterPage from '@/components/RegisterPage.vue'
import AdminDashboard from '@/components/admin/AdminDashboard.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path:'/',
    name: 'Initial',
    component: InitialPage
  },
  {
    path:'/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path:'/home',
    name: 'Home',
    component: HomePage
  },
  {
    path:'/personal',
    name: 'Personal',
    component: PersonalPage
  },
  {
    path:'/admin',
    name: 'Admin',
    component: AdminDashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router