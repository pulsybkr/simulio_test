<template>
  <Modal
    :is-open="isOpen"
    title="Créer un nouveau client"
    size="lg"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Prénom *
          </label>
          <Input
            v-model="form.firstName"
            type="text"
            placeholder="Jean"
            :variant="errors.firstName ? 'error' : 'default'"
            required
          />
          <p v-if="errors.firstName" class="text-red-500 text-xs mt-1">
            {{ errors.firstName }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nom *
          </label>
          <Input
            v-model="form.lastName"
            type="text"
            placeholder="Dupont"
            :variant="errors.lastName ? 'error' : 'default'"
            required
          />
          <p v-if="errors.lastName" class="text-red-500 text-xs mt-1">
            {{ errors.lastName }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <Input
            v-model="form.email"
            type="email"
            placeholder="jean.dupont@email.com"
            :variant="errors.email ? 'error' : 'default'"
            required
          />
          <p v-if="errors.email" class="text-red-500 text-xs mt-1">
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <Input
            v-model="form.phone"
            type="tel"
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Adresse
        </label>
        <textarea
          v-model="form.address"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="123 Rue de la Paix, 75001 Paris"
        ></textarea>
      </div>

      <!-- Informations sur la création automatique -->
      <div class="bg-blue-50 p-4 rounded-lg">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <h4 class="text-sm font-medium text-blue-800">
              Création automatique du compte
            </h4>
            <div class="mt-1 text-sm text-blue-700">
              <p>Un compte client sera automatiquement créé avec l'email fourni.</p>
              <p class="mt-1">Les identifiants de connexion seront affichés après la création.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Erreur générale -->
      <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
        <p class="text-sm text-red-700">{{ errorMessage }}</p>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button
          @click="$emit('close')"
          variant="outline"
        >
          Annuler
        </Button>
        <Button
          @click="handleSubmit"
          :disabled="isCreating || !isFormValid"
        >
          <span v-if="isCreating">Création en cours...</span>
          <span v-else>Créer le client</span>
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useClientStore } from '@/stores/client'
import Modal from './Modal.vue'
import Button from './Button.vue'
import Input from './Input.vue'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  clientCreated: [client: any]
}>()

const clientStore = useClientStore()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: ''
})

const errors = ref({
  firstName: '',
  lastName: '',
  email: ''
})

const errorMessage = ref('')
const isCreating = ref(false)
const generatedPassword = ref('')

const isFormValid = computed(() => {
  return form.value.firstName.trim() && 
         form.value.lastName.trim() && 
         form.value.email.trim() &&
         isValidEmail(form.value.email)
})

// Générer un mot de passe sécurisé
const generatePassword = () => {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''

  // S'assurer qu'il y a au moins une majuscule, une minuscule, un chiffre et un caractère spécial
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
  password += '0123456789'[Math.floor(Math.random() * 10)]
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]

  // Compléter avec des caractères aléatoires
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }

  // Mélanger les caractères
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const resetForm = () => {
  form.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  }
  errors.value = {
    firstName: '',
    lastName: '',
    email: ''
  }
  errorMessage.value = ''
  generatedPassword.value = generatePassword()
}

const handleSubmit = async () => {
  // Reset errors
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = ''
  })
  errorMessage.value = ''

  // Validation
  if (!form.value.firstName.trim()) {
    errors.value.firstName = 'Le prénom est requis'
    return
  }

  if (!form.value.lastName.trim()) {
    errors.value.lastName = 'Le nom est requis'
    return
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'L\'email est requis'
    return
  }

  if (!isValidEmail(form.value.email)) {
    errors.value.email = 'Format d\'email invalide'
    return
  }

  isCreating.value = true

  try {
    // Générer le mot de passe automatiquement
    const password = generatePassword()

    const clientData = {
      ...form.value,
      password: password
    }

    const newClient = await clientStore.createClient(clientData)

    // Passer le mot de passe généré avec le client
    const clientWithCredentials = {
      ...newClient,
      generatedPassword: password
    }

    emit('clientCreated', clientWithCredentials)
    resetForm()
    emit('close')
  } catch (error: any) {
    if (error.response?.data?.errors) {
      const validationErrors = error.response.data.errors
      Object.keys(validationErrors).forEach(field => {
        if (errors.value[field as keyof typeof errors.value] !== undefined) {
          errors.value[field as keyof typeof errors.value] = validationErrors[field][0]
        }
      })
    } else {
      errorMessage.value = error.response?.data?.message || 'Erreur lors de la création du client'
    }
  } finally {
    isCreating.value = false
  }
}

// Générer un mot de passe initial quand le modal s'ouvre
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && !generatedPassword.value) {
    generatedPassword.value = generatePassword()
  }
})
</script>
