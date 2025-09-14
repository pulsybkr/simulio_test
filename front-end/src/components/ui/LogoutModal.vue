<template>
  <Modal
    :isOpen="isOpen"
    title="Confirmer la déconnexion"
    size="sm"
    @close="handleClose"
  >
    <div class="flex items-start space-x-3">
      <div class="flex-shrink-0">
        <AlertTriangle class="h-6 w-6 text-yellow-600" />
      </div>
      <div class="flex-1">
        <p class="text-sm text-gray-600">
          Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button
          @click="handleClose"
          variant="outline"
          :disabled="isLoading"
        >
          Annuler
        </Button>
        <Button
          @click="handleConfirm"
          variant="destructive"
          :disabled="isLoading"
          :loading="isLoading"
        >
          Se déconnecter
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Modal from './Modal.vue'
import Button from './Button.vue'
import { AlertTriangle } from 'lucide-vue-next'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  confirmed: []
}>()

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)

const handleClose = () => {
  if (!isLoading.value) {
    emit('close')
  }
}

const handleConfirm = async () => {
  isLoading.value = true
  try {
    await authStore.logout()
    emit('confirmed')
    router.push('/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
