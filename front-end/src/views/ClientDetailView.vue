<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ client?.fullName || 'Client' }}
            </h1>
            <p class="mt-2 text-gray-600">
              Détails et simulations du client
            </p>
          </div>
          <router-link
            to="/clients"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            ← Retour à la liste
          </router-link>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Informations du client -->
        <div class="lg:col-span-1">
          <Card class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Informations personnelles
            </h3>

            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">Nom complet</dt>
                <dd class="text-sm text-gray-900">{{ client?.fullName }}</dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="text-sm text-gray-900">
                  {{ client?.email || 'Non renseigné' }}
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Téléphone</dt>
                <dd class="text-sm text-gray-900">
                  {{ client?.phone || 'Non renseigné' }}
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Adresse</dt>
                <dd class="text-sm text-gray-900">
                  {{ client?.address || 'Non renseignée' }}
                </dd>
              </div>

              <div v-if="client?.assignedAgent">
                <dt class="text-sm font-medium text-gray-500">Agent assigné</dt>
                <dd class="text-sm text-gray-900">
                  {{ client.assignedAgent.fullName }}
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Date d'inscription</dt>
                <dd class="text-sm text-gray-900">
                  {{ formatDate(client?.createdAt) }}
                </dd>
              </div>
            </dl>

            <!-- Actions (Admin & Agent seulement) -->
            <div class="mt-6 space-y-3" v-if="authStore.isAdmin || authStore.isAgent">
              <Button
                @click="showEditModal = true"
                variant="outline"
                class="w-full"
              >
                Modifier les informations
              </Button>

              <Button
                @click="createSimulation"
                class="w-full"
              >
                Créer une simulation
              </Button>
            </div>
          </Card>
        </div>

        <!-- Simulations du client -->
        <div class="lg:col-span-2">
          <Card class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                Simulations
              </h3>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {{ client?.simulations?.length || 0 }} simulation(s)
              </span>
            </div>

            <div v-if="!client?.simulations?.length" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune simulation</h3>
              <p class="mt-1 text-sm text-gray-500">
                Aucune simulation n'a encore été créée pour ce client.
              </p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="simulation in client.simulations"
                :key="simulation.id"
                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-3 h-3 rounded-full"
                      :class="{
                        'bg-yellow-400': simulation.status === 'processing',
                        'bg-green-400': simulation.status === 'completed',
                        'bg-red-400': simulation.status === 'failed',
                        'bg-gray-400': simulation.status === 'pending'
                      }"
                    ></div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">
                        {{ simulation.name }}
                      </h4>
                      <p class="text-sm text-gray-500">
                        Créé le {{ formatDate(simulation.createdAt) }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center space-x-3">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="{
                        'bg-yellow-100 text-yellow-800': simulation.status === 'processing',
                        'bg-green-100 text-green-800': simulation.status === 'completed',
                        'bg-red-100 text-red-800': simulation.status === 'failed',
                        'bg-gray-100 text-gray-800': simulation.status === 'pending'
                      }"
                    >
                      {{ simulation.status }}
                    </span>
                    <router-link
                      :to="`/simulations/${simulation.id}`"
                      class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Voir détails
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useClientStore } from '@/stores/client'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'

const route = useRoute()
const authStore = useAuthStore()
const clientStore = useClientStore()

const client = ref(null)
const showEditModal = ref(false)

onMounted(async () => {
  const clientId = route.params.id as string
  try {
    client.value = await clientStore.fetchClient(parseInt(clientId))
  } catch (error) {
    console.error('Erreur lors du chargement du client:', error)
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const createSimulation = () => {
  // Rediriger vers le wizard de simulation avec le client pré-sélectionné
  // TODO: Implémenter la logique de redirection
}
</script>
