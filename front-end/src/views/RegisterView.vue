<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Logo/Icon -->
      <div class="text-center mb-8">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          Créer un compte
        </h2>
        <p class="text-gray-600">
          Rejoignez Simulio pour commencer
        </p>
        <p class="mt-2 text-sm text-gray-500">
          Déjà membre ?
          <router-link
            to="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Connectez-vous
          </router-link>
        </p>
      </div>

      <!-- Card Container -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">

        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Nom et Prénom sur la même ligne -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="firstName" class="text-sm font-medium text-gray-700">Prénom</label>
              <Input
                id="firstName"
                v-model="form.firstName"
                name="firstName"
                type="text"
                autocomplete="given-name"
                required
                class="transition-all duration-200 hover:shadow-md focus:shadow-lg"
                placeholder="Votre prénom"
                :variant="errors.firstName ? 'error' : 'default'"
              />
              <p v-if="errors.firstName" class="text-xs text-red-500 flex items-center gap-1">
                <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errors.firstName }}
              </p>
            </div>

            <div class="space-y-2">
              <label for="lastName" class="text-sm font-medium text-gray-700">Nom</label>
              <Input
                id="lastName"
                v-model="form.lastName"
                name="lastName"
                type="text"
                autocomplete="family-name"
                required
                class="transition-all duration-200 hover:shadow-md focus:shadow-lg"
                placeholder="Votre nom"
                :variant="errors.lastName ? 'error' : 'default'"
              />
              <p v-if="errors.lastName" class="text-xs text-red-500 flex items-center gap-1">
                <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errors.lastName }}
              </p>
            </div>
          </div>

          <div class="space-y-2">
            <label for="email" class="text-sm font-medium text-gray-700">Adresse email</label>
            <Input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="transition-all duration-200 hover:shadow-md focus:shadow-lg"
              placeholder="votre@email.com"
              :variant="errors.email ? 'error' : 'default'"
            />
            <p v-if="errors.email" class="text-xs text-red-500 flex items-center gap-1">
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ errors.email }}
            </p>
          </div>

          <div class="space-y-2">
            <label for="password" class="text-sm font-medium text-gray-700">Mot de passe</label>
            <Input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="transition-all duration-200 hover:shadow-md focus:shadow-lg"
              placeholder="8 caractères minimum"
              :variant="errors.password ? 'error' : 'default'"
            />
            <p v-if="errors.password" class="text-xs text-red-500 flex items-center gap-1">
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ errors.password }}
            </p>
          </div>
          
          <div class="space-y-2">
            <label for="password_confirmation" class="text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <Input
              id="password_confirmation"
              v-model="form.password_confirmation"
              name="password_confirmation"
              type="password"
              autocomplete="new-password"
              required
              class="transition-all duration-200 hover:shadow-md focus:shadow-lg"
              placeholder="Répétez votre mot de passe"
              :variant="errors.password_confirmation ? 'error' : 'default'"
            />
            <p v-if="errors.password_confirmation" class="text-xs text-red-500 flex items-center gap-1">
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ errors.password_confirmation }}
            </p>
          </div>

          <!-- Message d'erreur global -->
          <div v-if="errorMessage" class="rounded-xl bg-red-50 border border-red-200 p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Erreur lors de l'inscription
                </h3>
                <div class="mt-1 text-sm text-red-700">
                  {{ errorMessage }}
                </div>
              </div>
            </div>
          </div>

          <!-- Exigences du mot de passe -->
          <div class="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">
                  Exigences du mot de passe
                </h3>
                <div class="mt-2 text-sm text-blue-700">
                  <div class="grid grid-cols-1 gap-1">
                    <div class="flex items-center gap-2">
                      <div class="h-1.5 w-1.5 bg-blue-400 rounded-full"></div>
                      <span>Au moins 8 caractères</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="h-1.5 w-1.5 bg-blue-400 rounded-full"></div>
                      <span>Une lettre majuscule et minuscule</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="h-1.5 w-1.5 bg-blue-400 rounded-full"></div>
                      <span>Un chiffre et un caractère spécial (@$!%*?&)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bouton de soumission -->
          <div class="pt-2">
            <Button
              type="submit"
              variant="default"
              size="lg"
              class="group relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="absolute left-1/2 transform -translate-x-1/2">
                <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <span v-else class="flex items-center gap-2">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Créer mon compte
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'admin' as 'client' | 'agent' | 'admin' | '',
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errorMessage = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  console.log('Début de la soumission du formulaire')
  console.log('Données du formulaire:', form)

  errorMessage.value = ''
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  if (!form.firstName.trim()) {
    console.log('Erreur: prénom requis')
    errors.firstName = 'Le prénom est requis'
    return
  }

  if (!form.lastName.trim()) {
    console.log('Erreur: nom requis')
    errors.lastName = 'Le nom est requis'
    return
  }

  if (!form.email) {
    console.log('Erreur: email requis')
    errors.email = 'L\'email est requis'
    return
  }

  if (!form.password) {
    console.log('Erreur: mot de passe requis')
    errors.password = 'Le mot de passe est requis'
    return
  }

  if (form.password.length < 8) {
    console.log('Erreur: mot de passe trop court')
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères'
    return
  }

  if (form.password !== form.password_confirmation) {
    console.log('Erreur: mots de passe ne correspondent pas')
    errors.password_confirmation = 'Les mots de passe ne correspondent pas'
    return
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  if (!passwordRegex.test(form.password)) {
    console.log('Erreur: mot de passe ne respecte pas les exigences')
    errors.password = 'Le mot de passe ne respecte pas les exigences de sécurité'
    return
  }

  console.log('Toutes les validations passées, envoi de la requête...')
  isLoading.value = true

  try {
    const registerData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      role: 'admin',
    }

    console.log('Données envoyées:', registerData)
    await authStore.register(registerData)
    console.log('Inscription réussie, redirection vers dashboard')
    router.push('/dashboard')
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription:', error)
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else if (error.response?.data?.errors) {
      const validationErrors = error.response.data.errors
      Object.keys(validationErrors).forEach(field => {
        if (errors[field as keyof typeof errors] !== undefined) {
          errors[field as keyof typeof errors] = validationErrors[field][0]
        }
      })
    } else {
      errorMessage.value = 'Une erreur inattendue s\'est produite'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
