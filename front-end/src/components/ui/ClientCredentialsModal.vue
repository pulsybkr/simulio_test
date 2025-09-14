<template>
  <Modal
    :is-open="isOpen"
    title="Client créé avec succès"
    size="md"
    @close="$emit('close')"
  >
    <div class="text-center">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
        <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ client.firstName }} {{ client.lastName }}
      </h3>

      <p class="text-sm text-gray-600 mb-6">
        Le compte client a été créé avec succès. Voici les informations de connexion :
      </p>

      <!-- Informations d'identification -->
      <div class="bg-gray-50 p-4 rounded-lg space-y-4 mb-6">
        <div class="flex items-center justify-between bg-white p-3 rounded border">
          <div>
            <span class="text-xs text-gray-500 block">Email de connexion</span>
            <div class="font-mono text-sm font-medium">{{ client.email }}</div>
          </div>
          <Button
            @click="copyToClipboard(client.email)"
            variant="outline"
            size="sm"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </Button>
        </div>

        <div class="flex items-center justify-between bg-white p-3 rounded border">
          <div>
            <span class="text-xs text-gray-500 block">Mot de passe temporaire</span>
            <div class="font-mono text-sm font-medium">{{ generatedPassword }}</div>
          </div>
          <div class="flex space-x-1">
            <Button
              @click="copyToClipboard(generatedPassword)"
              variant="outline"
              size="sm"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </Button>
            <Button
              @click="regeneratePassword"
              variant="outline"
              size="sm"
              class="hidden"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="bg-blue-50 p-4 rounded-lg mb-6 hidden">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-3 ">
            <h4 class="text-sm font-medium text-blue-800">
              Informations importantes
            </h4>
            <div class="mt-1 text-sm text-blue-700">
              <ul class="list-disc list-inside space-y-1">
                <li>Le client devra changer son mot de passe lors de sa première connexion</li>
                <li>Les identifiants ont été copiés automatiquement</li>
                <li>Vous pouvez régénérer un nouveau mot de passe si nécessaire</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-center space-x-3">
        <Button
          @click="sendCredentialsByEmail"
          variant="outline"
          :disabled="isSendingEmail"
        >
          <span v-if="isSendingEmail">Envoi en cours...</span>
          <span v-else>Envoyer par email</span>
        </Button>
        <Button @click="$emit('close')">
          Fermer
        </Button>
      </div>
    </div>

    <!-- Toast de confirmation de copie -->
    <div
      v-if="showCopyToast"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-all duration-300"
    >
      ✓ Copié dans le presse-papiers
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from './Modal.vue'
import Button from './Button.vue'
import { useClientStore } from '@/stores/client'

interface Props {
  isOpen: boolean
  client: any
  generatedPassword: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  passwordRegenerated: [password: string]
}>()

const clientStore = useClientStore()
const showCopyToast = ref(false)
const isSendingEmail = ref(false)

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

const regeneratePassword = () => {
  // Générer un nouveau mot de passe sécurisé
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
  const newPassword = password.split('').sort(() => Math.random() - 0.5).join('')

  emit('passwordRegenerated', newPassword)
}

const sendCredentialsByEmail = async () => {
  if (!props.client?.email) return

  isSendingEmail.value = true

  try {
    // Ici vous pouvez implémenter l'envoi d'email
    // await clientStore.sendCredentialsByEmail(props.client.id, props.generatedPassword)

    // Simulation d'un délai
    await new Promise(resolve => setTimeout(resolve, 1500))

    showCopyToast.value = true
    setTimeout(() => {
      showCopyToast.value = false
    }, 3000)
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error)
  } finally {
    isSendingEmail.value = false
  }
}

// Copier automatiquement les identifiants quand le modal s'ouvre
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.client?.email && props.generatedPassword) {
    // Copier automatiquement l'email et le mot de passe
    copyToClipboard(`${props.client.email}\n${props.generatedPassword}`)
  }
})
</script>
