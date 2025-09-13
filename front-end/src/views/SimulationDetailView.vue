<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ simulation?.name || 'Simulation' }}
            </h1>
            <p class="mt-2 text-gray-600">
              Détails et résultats de la simulation
            </p>
          </div>
          <div class="flex space-x-3">
            <router-link
              to="/simulations"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Retour à la liste
            </router-link>
            <Button
              v-if="simulation?.status === 'completed'"
              @click="exportResults"
            >
              Exporter
            </Button>
          </div>
        </div>
      </div>

      <!-- Statut de la simulation -->
      <div class="mb-6">
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div
                class="w-4 h-4 rounded-full"
                :class="{
                  'bg-yellow-400': simulation?.status === 'processing',
                  'bg-green-400': simulation?.status === 'completed',
                  'bg-red-400': simulation?.status === 'failed',
                  'bg-gray-400': simulation?.status === 'pending'
                }"
              ></div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  Statut: {{ getStatusLabel(simulation?.status) }}
                </h3>
                <p class="text-sm text-gray-500">
                  Créée le {{ formatDate(simulation?.createdAt) }} par {{ simulation?.createdBy?.fullName }}
                </p>
              </div>
            </div>

            <div v-if="simulation?.status === 'processing'" class="flex items-center space-x-2">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
              <span class="text-sm text-gray-600">Calcul en cours...</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Paramètres -->
        <div class="lg:col-span-1">
          <Card class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Paramètres de la simulation
            </h3>

            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">Montant du prêt</dt>
                <dd class="text-sm text-gray-900">
                  {{ formatCurrency(simulation?.parameters?.loanAmount) }}
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Durée</dt>
                <dd class="text-sm text-gray-900">
                  {{ simulation?.parameters?.duration }} ans
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Taux d'intérêt</dt>
                <dd class="text-sm text-gray-900">
                  {{ simulation?.parameters?.interestRate }}%
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Taux d'assurance</dt>
                <dd class="text-sm text-gray-900">
                  {{ simulation?.parameters?.insuranceRate }}%
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Apport</dt>
                <dd class="text-sm text-gray-900">
                  {{ formatCurrency(simulation?.parameters?.downPayment) }}
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Frais de notaire</dt>
                <dd class="text-sm text-gray-900">
                  {{ simulation?.parameters?.notaryFees }}%
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Frais d'agence</dt>
                <dd class="text-sm text-gray-900">
                  {{ simulation?.parameters?.agencyFees }}%
                </dd>
              </div>
            </dl>
          </Card>
        </div>

        <!-- Résultats -->
        <div class="lg:col-span-2">
          <div v-if="simulation?.status === 'completed' && simulation.results">
            <Card class="p-6 mb-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Résultats principaux
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-indigo-600">
                    {{ formatCurrency(simulation.results.monthlyPayment) }}
                  </div>
                  <div class="text-sm text-gray-500">Mensualité</div>
                </div>

                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">
                    {{ formatCurrency(simulation.results.totalCost) }}
                  </div>
                  <div class="text-sm text-gray-500">Coût total</div>
                </div>

                <div class="text-center">
                  <div class="text-2xl font-bold text-red-600">
                    {{ formatCurrency(simulation.results.totalInterest) }}
                  </div>
                  <div class="text-sm text-gray-500">Intérêts totaux</div>
                </div>

                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">
                    {{ formatCurrency(simulation.results.salaryRequirement) }}
                  </div>
                  <div class="text-sm text-gray-500">Salaire requis</div>
                </div>
              </div>
            </Card>

            <!-- Tableau d'amortissement -->
            <Card class="p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Tableau d'amortissement (aperçu)
              </h3>

              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Période
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mensualité
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capital
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Intérêts
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Restant dû
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="entry in simulation.results"
                      :key="entry.period"
                    >
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ entry.period }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ entry.date }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatCurrency(entry.payment) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatCurrency(entry.principal) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatCurrency(entry.interest) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatCurrency(entry.balance) }}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div v-if="simulation.results.amortizationTable.length > 12" class="text-center mt-4">
                  <p class="text-sm text-gray-500">
                    Affichage des 12 premières mensualités sur {{ simulation.results.amortizationTable.length }} au total
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <!-- États d'erreur ou de chargement -->
          <Card v-else-if="simulation?.status === 'failed'" class="p-6">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Erreur de calcul</h3>
              <p class="mt-1 text-sm text-gray-500">
                Une erreur s'est produite lors du calcul de la simulation.
              </p>
              <div class="mt-6">
                <Button @click="retrySimulation">
                  Réessayer
                </Button>
              </div>
            </div>
          </Card>

          <Card v-else class="p-6">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Simulation en cours</h3>
              <p class="mt-1 text-sm text-gray-500">
                Les résultats seront disponibles une fois le calcul terminé.
              </p>
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
import { useSimulationStore } from '@/stores/simulation'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'

const route = useRoute()
const simulationStore = useSimulationStore()

const simulation = ref(null)

onMounted(async () => {
  const simulationId = route.params.id as string
  try {
    simulation.value = await simulationStore.fetchSimulation(parseInt(simulationId))
  } catch (error) {
    console.error('Erreur lors du chargement de la simulation:', error)
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

const exportResults = () => {
  // TODO: Implémenter l'export des résultats
  console.log('Export des résultats')
}

const retrySimulation = () => {
  // TODO: Implémenter le retry de simulation
  console.log('Retry simulation')
}
</script>
