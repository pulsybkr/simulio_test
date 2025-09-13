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

      <!-- Génération automatique des identifiants -->
      <div class="bg-blue-50 p-4 rounded-lg">
        <h4 class="font-medium text-blue-900 mb-2">
          Accès client automatique
        </h4>
        <p class="text-sm text-blue-700 mb-3">
          Un compte sera automatiquement créé pour ce client avec les identifiants suivants :
        </p>
        
        <div class="space-y-2">
          <div class="flex items-center justify-between bg-white p-2 rounded border">
            <div>
              <span class="text-xs text-gray-500">Email de connexion :</span>
              <div class="font-mono text-sm">{{ form.email || 'email@example.com' }}</div>
            </div>
            <Button
              v-if="form.email"
              @click="copyToClipboard(form.email)"
              variant="outline"
              size="sm"
            >
              <Copy class="h-4 w-4" />
            </Button>
          </div>

          <div class="flex items-center justify-between bg-white p-2 rounded border">
            <div>
              <span class="text-xs text-gray-500">Mot de passe temporaire :</span>
              <div class="font-mono text-sm">{{ generatedPassword }}</div>
            </div>
            <div class="flex space-x-1">
              <Button
                @click="generateNewPassword"
                variant="outline"
                size="sm"
              >
                <RefreshCw class="h-4 w-4" />
              </Button>
              <Button
                @click="copyToClipboard(generatedPassword)"
                variant="outline"
                size="sm"
              >
                <Copy class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <p class="text-xs text-blue-600 mt-2">
          💡 Le client devra changer son mot de passe lors de sa première connexion
        </p>
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

  <!-- Toast de confirmation de copie -->
  <div
    v-if="showCopyToast"
    class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-all duration-300"
  >
    ✓ Copié dans le presse-papiers
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useClientStore } from '@/stores/client'
import Modal from './Modal.vue'
import Button from './Button.vue'
import Input from './Input.vue'
import { Copy, RefreshCw } from 'lucide-vue-next'

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
const showCopyToast = ref(false)

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

const generateNewPassword = () => {
  generatedPassword.value = generatePassword()
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    showCopyToast.value = true
    setTimeout(() => {
      showCopyToast.value = false
    }, 2000)
  } catch (err) {
    console.error('Erreur lors de la copie:', err)
  }
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
  generateNewPassword()
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
    const clientData = {
      ...form.value,
      password: generatedPassword.value
    }

    const newClient = await clientStore.createClient(clientData)
    emit('clientCreated', newClient)
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
    generateNewPassword()
  }
})
</script>
