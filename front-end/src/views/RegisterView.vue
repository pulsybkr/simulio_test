<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Créer un compte Simulio
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <router-link
            to="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            connectez-vous à votre compte
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <!-- Prénom -->
          <div>
            <label for="firstName" class="sr-only">Prénom</label>
            <Input
              id="firstName"
              v-model="form.firstName"
              name="firstName"
              type="text"
              autocomplete="given-name"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Prénom"
              :variant="errors.firstName ? 'error' : 'default'"
            />
            <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
          </div>

          <!-- Nom -->
          <div>
            <label for="lastName" class="sr-only">Nom</label>
            <Input
              id="lastName"
              v-model="form.lastName"
              name="lastName"
              type="text"
              autocomplete="family-name"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nom"
              :variant="errors.lastName ? 'error' : 'default'"
            />
            <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="sr-only">Adresse email</label>
            <Input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Adresse email"
              :variant="errors.email ? 'error' : 'default'"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="sr-only">Mot de passe</label>
            <Input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Mot de passe (8 caractères minimum)"
              :variant="errors.password ? 'error' : 'default'"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- Confirmation mot de passe -->
          <div>
            <label for="password_confirmation" class="sr-only">Confirmer le mot de passe</label>
            <Input
              id="password_confirmation"
              v-model="form.password_confirmation"
              name="password_confirmation"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirmer le mot de passe"
              :variant="errors.password_confirmation ? 'error' : 'default'"
            />
            <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">{{ errors.password_confirmation }}</p>
          </div>
        </div>


        <!-- Erreurs générales -->
        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Erreur lors de l'inscription
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>

        <!-- Informations sur le mot de passe -->
        <div class="rounded-md bg-blue-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                Exigences du mot de passe
              </h3>
              <div class="mt-2 text-sm text-blue-700">
                <ul class="list-disc list-inside space-y-1">
                  <li>Au moins 8 caractères</li>
                  <li>Au moins une lettre majuscule</li>
                  <li>Au moins une lettre minuscule</li>
                  <li>Au moins un chiffre</li>
                  <li>Au moins un caractère spécial (@$!%*?&)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            variant="default"
            size="lg"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="absolute left-1/2 transform -translate-x-1/2">
              <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span v-else>
              Créer mon compte
            </span>
          </Button>
        </div>
      </form>
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

  // Reset errors
  errorMessage.value = ''
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  // Validation basique côté client
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

  // Validation du mot de passe (regex basique)
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
      // Gérer les erreurs de validation individuelles
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
