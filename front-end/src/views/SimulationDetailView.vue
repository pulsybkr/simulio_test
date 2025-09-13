<template>
  <div class="p-6">
    <div>
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
              v-if="authStore.isAdmin || authStore.isAgent"
              @click="openEditModal"
              variant="outline"
            >
              Modifier les paramètres
            </Button>
            <Button
              v-if="simulation?.status === 'completed'"
              @click="exportResults"
            >
              Exporter
            </Button>
          </div>
        </div>
      </div>

      <!-- Statut et informations générales -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Statut de la simulation -->
        <div class="bg-white shadow rounded-lg p-6">
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
              <div v-if="simulation?.status === 'processing'" class="flex items-center space-x-2 mt-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                <span class="text-sm text-gray-600">Calcul en cours...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Client assigné -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Client</h3>
              <div v-if="simulation?.client" class="mt-2">
                <p class="text-sm font-medium text-gray-900">{{ simulation.client.fullName }}</p>
                <p class="text-sm text-gray-500">{{ simulation.client.email }}</p>
              </div>
              <div v-else class="mt-2">
                <p class="text-sm text-gray-500">Aucun client assigné</p>
              </div>
            </div>
            <Button
              v-if="!simulation?.client && (authStore.isAdmin || authStore.isAgent)"
              @click="openClientModal"
              variant="outline"
              size="sm"
            >
              Assigner un client
            </Button>
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

            <!-- Tableau d'amortissement (optionnel) -->
            <Card v-if="showAmortizationTable" class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-900">
                  Tableau d'amortissement
                </h3>
                <Button
                  @click="showAmortizationTable = false"
                  variant="outline"
                  size="sm"
                >
                  Masquer
                </Button>
              </div>

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
                      v-for="entry in paginatedAmortizationTable"
                      :key="entry.period"
                    >
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ entry.period }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatDate(entry.date) }}
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

                <!-- Pagination -->
                <div v-if="totalAmortizationPages > 1" class="flex items-center justify-between mt-4">
                  <div class="text-sm text-gray-500">
                    Affichage de {{ (currentAmortizationPage - 1) * itemsPerPage + 1 }} à 
                    {{ Math.min(currentAmortizationPage * itemsPerPage, simulation.results.amortizationTable.length) }} 
                    sur {{ simulation.results.amortizationTable.length }} entrées
                  </div>
                  <div class="flex space-x-2">
                    <Button
                      @click="currentAmortizationPage--"
                      :disabled="currentAmortizationPage === 1"
                      variant="outline"
                      size="sm"
                    >
                      Précédent
                    </Button>
                    <span class="px-3 py-1 text-sm text-gray-700">
                      Page {{ currentAmortizationPage }} sur {{ totalAmortizationPages }}
                    </span>
                    <Button
                      @click="currentAmortizationPage++"
                      :disabled="currentAmortizationPage === totalAmortizationPages"
                      variant="outline"
                      size="sm"
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <!-- Bouton pour afficher le tableau d'amortissement -->
            <Card v-else class="p-6 text-center">
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                Tableau d'amortissement
              </h3>
              <p class="text-sm text-gray-500 mb-4">
                Consultez le détail mensuel de votre remboursement
              </p>
              <Button
                @click="showAmortizationTable = true"
                variant="outline"
              >
                Afficher le tableau d'amortissement
              </Button>
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

    <!-- Modal d'édition des paramètres -->
    <Modal
      :is-open="showEditModal"
      title="Modifier les paramètres"
      size="lg"
      @close="closeEditModal"
    >
      <div v-if="editParameters" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Montant du prêt (€)
            </label>
            <Input
              v-model.number="editParameters.loanAmount"
              type="number"
              placeholder="250000"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Durée (années)
            </label>
            <select
              v-model.number="editParameters.duration"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="10">10 ans</option>
              <option value="15">15 ans</option>
              <option value="20">20 ans</option>
              <option value="25">25 ans</option>
              <option value="30">30 ans</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Taux d'intérêt annuel (%)
            </label>
            <Input
              v-model.number="editParameters.interestRate"
              type="number"
              step="0.01"
              placeholder="3.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Apport (€)
            </label>
            <Input
              v-model.number="editParameters.downPayment"
              type="number"
              placeholder="50000"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <Button
            @click="closeEditModal"
            variant="outline"
          >
            Annuler
          </Button>
          <Button
            @click="saveParameters"
            :disabled="isUpdating"
          >
            <span v-if="isUpdating">Mise à jour...</span>
            <span v-else>Sauvegarder et recalculer</span>
          </Button>
        </div>
      </template>
    </Modal>

    <!-- Modal d'assignation de client -->
    <Modal
      :is-open="showClientModal"
      title="Assigner un client"
      size="md"
      @close="closeClientModal"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Choisir un client existant
          </label>
          <select
            v-model="selectedClientId"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Sélectionner un client</option>
            <option
              v-for="client in clients"
              :key="client.id"
              :value="client.id"
            >
              {{ client.fullName }} - {{ client.email }}
            </option>
          </select>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-500 mb-2">ou</p>
          <Button
            @click="openCreateClientModal"
            variant="outline"
          >
            Créer un nouveau client
          </Button>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <Button
            @click="closeClientModal"
            variant="outline"
          >
            Annuler
          </Button>
          <Button
            @click="assignClient"
            :disabled="!selectedClientId || isAssigningClient"
          >
            <span v-if="isAssigningClient">Attribution...</span>
            <span v-else>Assigner</span>
          </Button>
        </div>
      </template>
    </Modal>

    <!-- Modal de création de client -->
    <CreateClientModal
      :is-open="showCreateClientModal"
      @close="closeCreateClientModal"
      @client-created="handleClientCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSimulationStore } from '@/stores/simulation'
import { useClientStore } from '@/stores/client'
import { useAuthStore } from '@/stores/auth'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import CreateClientModal from '@/components/ui/CreateClientModal.vue'
import type { SimulationParameters } from '@/types'

const route = useRoute()
const simulationStore = useSimulationStore()
const clientStore = useClientStore()
const authStore = useAuthStore()

const simulation = ref(null)
const showAmortizationTable = ref(false)
const currentAmortizationPage = ref(1)
const itemsPerPage = ref(20)

// Modal states
const showEditModal = ref(false)
const showClientModal = ref(false)
const showCreateClientModal = ref(false)
const editParameters = ref<SimulationParameters | null>(null)
const selectedClientId = ref('')
const isUpdating = ref(false)
const isAssigningClient = ref(false)

// Computed properties
const clients = computed(() => clientStore.clients)

const paginatedAmortizationTable = computed(() => {
  if (!simulation.value?.results?.amortizationTable) return []
  
  const start = (currentAmortizationPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return simulation.value.results.amortizationTable.slice(start, end)
})

const totalAmortizationPages = computed(() => {
  if (!simulation.value?.results?.amortizationTable) return 0
  return Math.ceil(simulation.value.results.amortizationTable.length / itemsPerPage.value)
})

onMounted(async () => {
  const simulationId = route.params.id as string
  try {
    simulation.value = await simulationStore.fetchSimulation(parseInt(simulationId))
    // Charger les clients pour le modal d'assignation
    await clientStore.fetchClients()
  } catch (error) {
    console.error('Erreur lors du chargement de la simulation:', error)
  }
})

// Modal functions
const openEditModal = () => {
  if (simulation.value?.parameters) {
    editParameters.value = { ...simulation.value.parameters }
    showEditModal.value = true
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editParameters.value = null
}

const saveParameters = async () => {
  if (!editParameters.value || !simulation.value) return
  
  isUpdating.value = true
  try {
    const updatedSimulation = await simulationStore.updateSimulation(
      simulation.value.id,
      { parameters: editParameters.value }
    )
    simulation.value = updatedSimulation
    closeEditModal()
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
  } finally {
    isUpdating.value = false
  }
}

const openClientModal = () => {
  selectedClientId.value = ''
  showClientModal.value = true
}

const closeClientModal = () => {
  showClientModal.value = false
  selectedClientId.value = ''
}

const assignClient = async () => {
  if (!selectedClientId.value || !simulation.value) return
  
  isAssigningClient.value = true
  try {
    const updatedSimulation = await simulationStore.updateSimulation(
      simulation.value.id,
      { clientId: parseInt(selectedClientId.value) }
    )
    simulation.value = updatedSimulation
    closeClientModal()
  } catch (error) {
    console.error('Erreur lors de l\'assignation:', error)
  } finally {
    isAssigningClient.value = false
  }
}

const openCreateClientModal = () => {
  closeClientModal()
  showCreateClientModal.value = true
}

const closeCreateClientModal = () => {
  showCreateClientModal.value = false
}

const handleClientCreated = (newClient: any) => {
  // Sélectionner automatiquement le nouveau client
  selectedClientId.value = newClient.id.toString()
  // Rouvrir le modal d'assignation
  showClientModal.value = true
}

// Utility functions
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

const retrySimulation = async () => {
  if (!simulation.value) return
  
  try {
    const updatedSimulation = await simulationStore.updateSimulation(
      simulation.value.id,
      { parameters: simulation.value.parameters }
    )
    simulation.value = updatedSimulation
  } catch (error) {
    console.error('Erreur lors du retry:', error)
  }
}
</script>
