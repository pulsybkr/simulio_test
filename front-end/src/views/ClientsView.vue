<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            Gestion des Clients
          </h1>
          <p class="mt-2 text-gray-600">
            Gérez vos clients et leurs informations
          </p>
        </div>

        <Button
          v-if="authStore.isAdmin || authStore.isAgent"
          @click="showCreateClientModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nouveau Client
        </Button>
      </div>

      <div class="mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <Input
              v-model="searchQuery"
              placeholder="Rechercher un client..."
              class="w-full"
            />
          </div>
          <select
            v-model="statusFilter"
            class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li
            v-for="client in filteredClients"
            :key="client.id"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-medium text-sm">
                      {{ client.firstName[0] }}{{ client.lastName[0] }}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ client.fullName }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ client.email || 'Pas d\'email' }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ client.phone || 'Pas de téléphone' }}
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-4">
                <div v-if="client.assignedAgent" class="text-right">
                  <div class="text-sm font-medium text-gray-900">
                    {{ client.assignedAgent.fullName }}
                  </div>
                  <div class="text-sm text-gray-500">
                    Agent
                  </div>
                </div>

                <div class="flex space-x-2">
                  <router-link
                    :to="`/clients/${client.id}`"
                    class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Voir
                  </router-link>

                  <button
                    v-if="authStore.isAdmin || authStore.isAgent"
                    @click="editClient(client)"
                    class="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <div v-if="filteredClients.length === 0 && !isLoading" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun client</h3>
          <p class="mt-1 text-sm text-gray-500">
            Commencez par créer votre premier client.
          </p>
          <div class="mt-6" v-if="authStore.isAdmin || authStore.isAgent">
            <Button @click="showCreateClientModal = true">
              Créer un client
            </Button>
          </div>
        </div>
      </div>

      <div v-if="filteredClients.length > 0" class="mt-6">
      </div>
    </div>

    <CreateClientModal
      :is-open="showCreateClientModal"
      @close="closeCreateClientModal"
      @client-created="handleClientCreated"
    />

    <ClientCredentialsModal
      :is-open="showCredentialsModal"
      :client="createdClient"
      :generated-password="generatedPassword"
      @close="closeCredentialsModal"
      @password-regenerated="handlePasswordRegenerated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useClientStore } from '@/stores/client'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import CreateClientModal from '@/components/ui/CreateClientModal.vue'
import ClientCredentialsModal from '@/components/ui/ClientCredentialsModal.vue'

const authStore = useAuthStore()
const clientStore = useClientStore()

const searchQuery = ref('')
const statusFilter = ref('')
const showCreateClientModal = ref(false)
const showCredentialsModal = ref(false)
const createdClient = ref<any>(null)
const generatedPassword = ref('')

const filteredClients = computed(() => {
  let clients = clientStore.clients

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    clients = clients.filter(client =>
      client.fullName.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.phone?.includes(query)
    )
  }

    // if (statusFilter.value) {
  //   clients = clients.filter(client => client.status === statusFilter.value)
  // }

  return clients
})

const isLoading = computed(() => clientStore.isLoading)

onMounted(async () => {
  try {
    await clientStore.fetchClients()
  } catch (error) {
    console.error('Erreur lors du chargement des clients:', error)
  }
})

const closeCreateClientModal = () => {
  showCreateClientModal.value = false
}

const handleClientCreated = (newClient: any) => {
  createdClient.value = newClient
  generatedPassword.value = newClient.generatedPassword || ''

  showCreateClientModal.value = false

  showCredentialsModal.value = true
}

const closeCredentialsModal = () => {
  showCredentialsModal.value = false
  createdClient.value = null
  generatedPassword.value = ''

  clientStore.fetchClients()
}

const handlePasswordRegenerated = (newPassword: string) => {
  generatedPassword.value = newPassword
}
</script>
