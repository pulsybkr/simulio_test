import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import des stores
import { useAuthStore } from '@/stores/auth'

// Import des composants UI
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Card from '@/components/ui/Card.vue'

// Configuration du router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', component: () => import('@/views/LoginView.vue') },
    { path: '/register', component: () => import('@/views/RegisterView.vue') },
    { path: '/dashboard', component: () => import('@/views/DashboardView.vue'), meta: { requiresAuth: true } },
    { 
      path: '/clients', 
      component: () => import('@/views/ClientsView.vue'), 
      meta: { requiresAuth: true, requiresRole: ['admin', 'agent'] } 
    },
    { 
      path: '/clients/:id', 
      component: () => import('@/views/ClientDetailView.vue'), 
      meta: { requiresAuth: true, requiresRole: ['admin', 'agent'] } 
    },
    { path: '/simulations', component: () => import('@/views/SimulationsView.vue'), meta: { requiresAuth: true } },
    { path: '/simulations/:id', component: () => import('@/views/SimulationDetailView.vue'), meta: { requiresAuth: true } },
    {
      path: '/simulate',
      component: () => import('@/views/SimulationWizardView.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

// Garde de navigation pour l'authentification et les rôles
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Vérifier l'authentification
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  // Vérifier les rôles si spécifiés
  if (to.meta.requiresRole && authStore.isAuthenticated) {
    const requiredRoles = to.meta.requiresRole as string[]
    const userRole = authStore.role
    
    if (!requiredRoles.includes(userRole)) {
      // Rediriger vers le dashboard avec un message d'erreur
      next('/dashboard')
      return
    }
  }

  next()
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Enregistrement des composants globaux
app.component('Button', Button)
app.component('Input', Input)
app.component('Card', Card)

// Initialisation de l'authentification
const authStore = useAuthStore()
authStore.initialize()

app.mount('#app')
