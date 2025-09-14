<template>
  <div class="p-6">
    <div>
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Bienvenue, {{ authStore.fullName }}
        </h1>
        <p class="mt-2 text-gray-600">
          Voici un aperçu de votre activité sur Simulio
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <!-- Simulations Card -->
        <Card class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Simulations
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.simulationsCount }}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <!-- Clients Card (pour agents et admins) -->
        <Card v-if="authStore.isAdmin || authStore.isAgent" class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Clients
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.clientsCount }}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <!-- Simulations en cours -->
        <Card class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  En cours
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.processingCount }}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <!-- Simulations terminées -->
        <Card class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Terminées
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.completedCount }}
                </dd>
              </dl>
            </div>
          </div>
        </Card>
      </div>

      <!-- Actions rapides -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Actions rapides
          </h3>
          <div class="flex flex-wrap gap-4">
            <!-- Bouton de création pour tous les utilisateurs -->
            <router-link
              to="/simulate"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouvelle simulation
            </router-link>

            <!-- Boutons pour admins et agents uniquement -->
            <router-link
              v-if="authStore.isAdmin || authStore.isAgent"
              to="/clients"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              Gérer les clients
            </router-link>

            <!-- Message pour les clients -->
            <div v-if="authStore.isClient" class="text-center py-4 w-full">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-center justify-center mb-2">
                  <svg class="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h4 class="text-sm font-medium text-blue-900">Espace Client</h4>
                </div>
                <p class="text-sm text-blue-700 mb-3">
                  Créez vos propres simulations financières, modifiez les paramètres existants pour créer des variantes, et consultez vos résultats détaillés.
                </p>
                <router-link
                  to="/simulations"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Voir mes simulations
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Simulations récentes -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Simulations récentes
          </h3>

          <div v-if="recentSimulations.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune simulation</h3>
            <p class="mt-1 text-sm text-gray-500">
              Commencez par créer votre première simulation.
            </p>
            <div v-if="authStore.isAdmin || authStore.isAgent" class="mt-6">
              <router-link
                to="/simulate"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Créer une simulation
              </router-link>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="simulation in recentSimulations"
              :key="simulation.id"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div
                      class="w-3 h-3 rounded-full"
                      :class="{
                        'bg-yellow-400': simulation.status === 'processing',
                        'bg-green-400': simulation.status === 'completed',
                        'bg-red-400': simulation.status === 'failed',
                        'bg-gray-400': simulation.status === 'pending'
                      }"
                    ></div>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-sm font-medium text-gray-900">
                      {{ simulation.name }}
                    </h4>
                    <p class="text-sm text-gray-500">
                      Client: {{ simulation.client ? simulation.client.fullName : 'Aucun client assigné' }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSimulationStore } from '@/stores/simulation'
import Card from '@/components/ui/Card.vue'

const authStore = useAuthStore()
const simulationStore = useSimulationStore()

const recentSimulations = ref([])
const stats = ref({
  simulationsCount: 0,
  clientsCount: 0,
  processingCount: 0,
  completedCount: 0,
})

onMounted(async () => {
  try {
    // Charger les simulations récentes
    await simulationStore.fetchSimulations()

    // Calculer les statistiques
    const allSimulations = simulationStore.simulations
    recentSimulations.value = allSimulations.slice(0, 5)

    stats.value = {
      simulationsCount: allSimulations.length,
      clientsCount: 0, // À implémenter avec le store clients
      processingCount: allSimulations.filter(s => s.status === 'processing').length,
      completedCount: allSimulations.filter(s => s.status === 'completed').length,
    }
  } catch (error) {
    console.error('Erreur lors du chargement du dashboard:', error)
  }
})
</script>
