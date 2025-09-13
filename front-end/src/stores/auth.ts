import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { authService } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)

  // Getters
  const fullName = computed(() => user.value?.fullName || '')
  const role = computed(() => user.value?.role || null)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isAgent = computed(() => user.value?.role === 'agent')
  const isClient = computed(() => user.value?.role === 'client')

  // Actions
  async function login(email: string, password: string) {
    isLoading.value = true
    try {
      const response = await authService.login({ email, password })
      user.value = response.user
      isAuthenticated.value = true
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function register(userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    password_confirmation: string
    role?: 'admin' | 'agent' | 'client'
  }) {
    isLoading.value = true
    try {
      const response = await authService.register(userData)
      user.value = response.user
      isAuthenticated.value = true
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    try {
      await authService.logout()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      user.value = null
      isAuthenticated.value = false
      isLoading.value = false
    }
  }

  async function checkAuth() {
    const storedUser = authService.getStoredUser()
    const token = authService.getStoredToken()

    if (storedUser && token) {
      user.value = storedUser
      isAuthenticated.value = true

      try {
        // Vérifier si le token est toujours valide
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          user.value = currentUser
        }
      } catch (error) {
        // Token invalide, nettoyer
        await logout()
      }
    }
  }

  function initialize() {
    checkAuth()
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,

    // Getters
    fullName,
    role,
    isAdmin,
    isAgent,
    isClient,

    // Actions
    login,
    register,
    logout,
    checkAuth,
    initialize,
  }
})
