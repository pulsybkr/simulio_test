<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/ui/Sidebar.vue'

const authStore = useAuthStore()
const route = useRoute()

const showSidebar = computed(() => {
  return authStore.isAuthenticated && !['/login', '/register'].includes(route.path)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar Layout -->
    <Sidebar v-if="showSidebar">
      <router-view />
    </Sidebar>

    <!-- Auth Pages (Login/Register) -->
    <div v-else class="min-h-screen">
      <router-view />
    </div>

    <!-- Loading Overlay -->
    <div
      v-if="authStore.isLoading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 flex items-center space-x-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span class="text-gray-700">Chargement...</span>
      </div>
    </div>
  </div>
</template>