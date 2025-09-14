<template>
  <div class="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
            Mes Simulations
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
            {{ authStore.isClient ? 'Consultez vos simulations financières' : 'Gérez et consultez vos simulations financières' }}
          </p>
        </div>

        <router-link
          v-if="!authStore.isClient"
          to="/simulate"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nouvelle Simulation
        </router-link>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <Input
              v-model="searchQuery"
              placeholder="Rechercher une simulation..."
              class="w-full"
            />
          </div>
          <select
            v-model="statusFilter"
            class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 min-w-[160px]"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="processing">En cours</option>
            <option value="completed">Terminée</option>
            <option value="failed">Échouée</option>
          </select>
        </div>
      </div>

      <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <ul class="divide-y divide-gray-200">
          <li
            v-for="simulation in filteredSimulations"
            :key="simulation.id"
            class="hover:bg-gray-50 transition-colors duration-150"
          >
            <div class="hidden sm:block px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div
                    class="w-4 h-4 rounded-full flex-shrink-0"
                    :class="{
                      'bg-yellow-400': simulation.status === 'processing',
                      'bg-green-400': simulation.status === 'completed',
                      'bg-red-400': simulation.status === 'failed',
                      'bg-gray-400': simulation.status === 'pending'
                    }"
                  ></div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-medium text-gray-900 truncate">
                          {{ simulation.name }}
                        </h4>
                        <p class="text-sm text-gray-500 truncate">
                          Client: {{ simulation.client ? simulation.client.fullName : 'Aucun client assigné' }}
                        </p>
                      </div>

                      <div class="text-right ml-4">
                        <p class="text-sm text-gray-900" v-if="simulation.results?.monthlyPayment">
                          {{ formatCurrency(simulation.results.monthlyPayment) }}/mois
                        </p>
                        <p class="text-sm text-gray-500">
                          {{ formatDate(simulation.createdAt) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex items-center space-x-4 ml-4">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                    :class="{
                      'bg-yellow-100 text-yellow-800': simulation.status === 'processing',
                      'bg-green-100 text-green-800': simulation.status === 'completed',
                      'bg-red-100 text-red-800': simulation.status === 'failed',
                      'bg-gray-100 text-gray-800': simulation.status === 'pending'
                    }"
                  >
                    {{ getStatusLabel(simulation.status) }}
                  </span>

                  <router-link
                    :to="`/simulations/${simulation.id}`"
                    class="text-indigo-600 hover:text-indigo-900 text-sm font-medium whitespace-nowrap"
                  >
                    Voir détails
                  </router-link>
                </div>
              </div>
            </div>

            <div class="sm:hidden p-4">
              <div class="flex items-start space-x-3">
                <div
                  class="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                  :class="{
                    'bg-yellow-400': simulation.status === 'processing',
                    'bg-green-400': simulation.status === 'completed',
                    'bg-red-400': simulation.status === 'failed',
                    'bg-gray-400': simulation.status === 'pending'
                  }"
                ></div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                      <h4 class="text-base font-medium text-gray-900 leading-tight">
                        {{ simulation.name }}
                      </h4>
                      <p class="text-sm text-gray-500 mt-1">
                        {{ simulation.client ? simulation.client.fullName : 'Aucun client assigné' }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ formatDate(simulation.createdAt) }}
                      </p>
                      <p class="text-sm text-gray-900 font-medium mt-1" v-if="simulation.results?.monthlyPayment">
                        {{ formatCurrency(simulation.results.monthlyPayment) }}/mois
                      </p>
                    </div>

                    <div class="flex flex-col items-end space-y-2 ml-4">
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                        :class="{
                          'bg-yellow-100 text-yellow-800': simulation.status === 'processing',
                          'bg-green-100 text-green-800': simulation.status === 'completed',
                          'bg-red-100 text-red-800': simulation.status === 'failed',
                          'bg-gray-100 text-gray-800': simulation.status === 'pending'
                        }"
                      >
                        {{ getStatusLabel(simulation.status) }}
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
            </div>
          </li>
        </ul>

        <div v-if="filteredSimulations.length === 0 && !isLoading" class="text-center py-12 px-6">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune simulation</h3>
          <p class="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
            {{ authStore.isClient ? 'Vos simulations apparaîtront ici une fois créées.' : 'Commencez par créer votre première simulation.' }}
          </p>
          <div v-if="!authStore.isClient" class="mt-6">
            <router-link
              to="/simulate"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Créer une simulation
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-sm text-gray-500">Chargement des simulations...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSimulationStore } from '@/stores/simulation'
import { useAuthStore } from '@/stores/auth'
import Input from '@/components/ui/Input.vue'

const simulationStore = useSimulationStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const statusFilter = ref('')

const filteredSimulations = computed(() => {
  let simulations = simulationStore.simulations

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    simulations = simulations.filter(simulation =>
      simulation.name.toLowerCase().includes(query) ||
      simulation.client.fullName.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    simulations = simulations.filter(simulation => simulation.status === statusFilter.value)
  }

  return simulations
})

const isLoading = computed(() => simulationStore.isLoading)

onMounted(async () => {
  try {
    await simulationStore.fetchSimulations()
  } catch (error) {
    console.error('Erreur lors du chargement des simulations:', error)
  }
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const getStatusLabel = (status: string) => {
  const labels = {
    pending: 'En attente',
    processing: 'En cours',
    completed: 'Terminée',
    failed: 'Échouée',
  }
  return labels[status as keyof typeof labels] || status
}
</script>
