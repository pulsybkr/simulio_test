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

        <!-- Bouton d'ajout (Admin & Agent seulement) -->
        <Button
          v-if="authStore.isAdmin || authStore.isAgent"
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nouveau Client
        </Button>
      </div>

      <!-- Filtres et recherche -->
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

      <!-- Liste des clients -->
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
                <!-- Agent assigné -->
                <div v-if="client.assignedAgent" class="text-right">
                  <div class="text-sm font-medium text-gray-900">
                    {{ client.assignedAgent.fullName }}
                  </div>
                  <div class="text-sm text-gray-500">
                    Agent
                  </div>
                </div>

                <!-- Actions -->
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

        <!-- État vide -->
        <div v-if="filteredClients.length === 0 && !isLoading" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun client</h3>
          <p class="mt-1 text-sm text-gray-500">
            Commencez par créer votre premier client.
          </p>
          <div class="mt-6" v-if="authStore.isAdmin || authStore.isAgent">
            <Button @click="showCreateModal = true">
              Créer un client
            </Button>
          </div>
        </div>
      </div>

      <!-- Pagination (si nécessaire) -->
      <div v-if="filteredClients.length > 0" class="mt-6">
        <!-- Pagination component could be added here -->
      </div>
    </div>

    <!-- Modal de création/édition -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click.self="closeModal"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showCreateModal ? 'Nouveau Client' : 'Modifier le Client' }}
          </h3>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Prénom</label>
                <Input
                  v-model="clientForm.firstName"
                  required
                  :variant="formErrors.firstName ? 'error' : 'default'"
                />
                <p v-if="formErrors.firstName" class="text-red-500 text-xs mt-1">
                  {{ formErrors.firstName }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Nom</label>
                <Input
                  v-model="clientForm.lastName"
                  required
                  :variant="formErrors.lastName ? 'error' : 'default'"
                />
                <p v-if="formErrors.lastName" class="text-red-500 text-xs mt-1">
                  {{ formErrors.lastName }}
                </p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <Input
                v-model="clientForm.email"
                type="email"
                :variant="formErrors.email ? 'error' : 'default'"
              />
              <p v-if="formErrors.email" class="text-red-500 text-xs mt-1">
                {{ formErrors.email }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Téléphone</label>
              <Input
                v-model="clientForm.phone"
                :variant="formErrors.phone ? 'error' : 'default'"
              />
              <p v-if="formErrors.phone" class="text-red-500 text-xs mt-1">
                {{ formErrors.phone }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Adresse</label>
              <textarea
                v-model="clientForm.address"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                rows="3"
              ></textarea>
            </div>

            <!-- Sélection de l'agent (Admin seulement) -->
            <div v-if="authStore.isAdmin">
              <label class="block text-sm font-medium text-gray-700">Agent assigné</label>
              <select
                v-model="clientForm.assignedAgentId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Sélectionner un agent</option>
                <option
                  v-for="agent in availableAgents"
                  :key="agent.id"
                  :value="agent.id"
                >
                  {{ agent.fullName }}
                </option>
              </select>
            </div>

            <!-- Erreur générale -->
            <div v-if="modalError" class="rounded-md bg-red-50 p-4">
              <p class="text-sm text-red-700">{{ modalError }}</p>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                @click="closeModal"
                variant="outline"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                :disabled="modalLoading"
              >
                <span v-if="modalLoading">Enregistrement...</span>
                <span v-else>{{ showCreateModal ? 'Créer' : 'Modifier' }}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useClientStore } from '@/stores/client'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'

const authStore = useAuthStore()
const clientStore = useClientStore()

const searchQuery = ref('')
const statusFilter = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const modalLoading = ref(false)
const modalError = ref('')

const clientForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  assignedAgentId: null as number | null,
})

const formErrors = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

// Mock data pour les agents disponibles (à remplacer par une vraie API)
const availableAgents = ref([
  { id: 1, firstName: 'Jean', lastName: 'Dupont', fullName: 'Jean Dupont' },
  { id: 2, firstName: 'Marie', lastName: 'Martin', fullName: 'Marie Martin' },
])

const filteredClients = computed(() => {
  let clients = clientStore.clients

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    clients = clients.filter(client =>
      client.fullName.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.phone?.includes(query)
    )
  }

  // Filtre par statut (si implémenté)
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

const editClient = (client: any) => {
  clientForm.value = {
    firstName: client.firstName,
    lastName: client.lastName,
    email: client.email || '',
    phone: client.phone || '',
    address: client.address || '',
    assignedAgentId: client.assignedAgentId,
  }
  showEditModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  modalError.value = ''
  // Reset form
  Object.keys(clientForm.value).forEach(key => {
    (clientForm.value as any)[key] = ''
  })
  // Reset errors
  Object.keys(formErrors.value).forEach(key => {
    (formErrors.value as any)[key] = ''
  })
}

const handleSubmit = async () => {
  modalLoading.value = true
  modalError.value = ''

  try {
    // Validation basique
    if (!clientForm.value.firstName.trim()) {
      formErrors.value.firstName = 'Le prénom est requis'
      return
    }

    if (!clientForm.value.lastName.trim()) {
      formErrors.value.lastName = 'Le nom est requis'
      return
    }

    if (showCreateModal.value) {
      await clientStore.createClient(clientForm.value)
    } else {
      // Pour l'édition, il faudrait passer l'ID du client
      // await clientStore.updateClient(clientId, clientForm.value)
    }

    closeModal()
  } catch (error: any) {
    modalError.value = error.response?.data?.message || 'Une erreur s\'est produite'
  } finally {
    modalLoading.value = false
  }
}
</script>
