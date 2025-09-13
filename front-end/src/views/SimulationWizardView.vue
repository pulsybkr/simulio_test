<template>
  <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              Nouvelle Simulation
            </h1>
            <p class="mt-2 text-gray-600">
              Créez une simulation financière en suivant les étapes
            </p>
          </div>
          <router-link
            to="/simulations"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            ← Retour aux simulations
          </router-link>
        </div>
      </div>

      <!-- Étapes du wizard -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="flex items-center"
            :class="{ 'flex-1': index < steps.length - 1 }"
          >
            <div class="flex flex-col items-center">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                :class="{
                  'bg-indigo-600 text-white': step.id === currentStep,
                  'bg-green-600 text-white': step.id < currentStep,
                  'bg-gray-200 text-gray-600': step.id > currentStep
                }"
              >
                <span v-if="step.id < currentStep">✓</span>
                <span v-else>{{ step.id }}</span>
              </div>
              <div class="mt-2 text-xs text-center">
                <div class="font-medium" :class="{
                  'text-indigo-600': step.id === currentStep,
                  'text-green-600': step.id < currentStep,
                  'text-gray-500': step.id > currentStep
                }">
                  {{ step.title }}
                </div>
              </div>
            </div>
            <div
              v-if="index < steps.length - 1"
              class="flex-1 h-0.5 mx-4"
              :class="{
                'bg-indigo-600': step.id < currentStep,
                'bg-gray-200': step.id >= currentStep
              }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Contenu des étapes -->
      <Card class="p-6">
        <!-- Étape 1: Sélection du client -->
        <div v-if="currentStep === 1">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Sélection du client
          </h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Choisir un client existant
              </label>
              <select
                v-model="selectedClientId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                :disabled="isLoadingClients"
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
              <p v-if="isLoadingClients" class="text-sm text-gray-500 mt-1">
                Chargement des clients...
              </p>
            </div>

            <div v-if="selectedClient" class="bg-gray-50 p-4 rounded-md">
              <h4 class="font-medium text-gray-900">Client sélectionné :</h4>
              <p class="text-sm text-gray-600">{{ selectedClient.fullName }}</p>
              <p class="text-sm text-gray-600">{{ selectedClient.email }}</p>
            </div>
          </div>
        </div>

        <!-- Étape 2: Paramètres du prêt -->
        <div v-if="currentStep === 2">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Paramètres du prêt
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Montant du prêt (€)
              </label>
              <Input
                v-model.number="parameters.loanAmount"
                type="number"
                placeholder="250000"
                :variant="errors.loanAmount ? 'error' : 'default'"
              />
              <p v-if="errors.loanAmount" class="text-red-500 text-xs mt-1">
                {{ errors.loanAmount }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Durée (années)
              </label>
              <select
                v-model.number="parameters.duration"
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
                v-model.number="parameters.interestRate"
                type="number"
                step="0.01"
                placeholder="3.5"
                :variant="errors.interestRate ? 'error' : 'default'"
              />
              <p v-if="errors.interestRate" class="text-red-500 text-xs mt-1">
                {{ errors.interestRate }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Taux d'assurance annuel (%)
              </label>
              <Input
                v-model.number="parameters.insuranceRate"
                type="number"
                step="0.01"
                placeholder="0.3"
                :variant="errors.insuranceRate ? 'error' : 'default'"
              />
              <p v-if="errors.insuranceRate" class="text-red-500 text-xs mt-1">
                {{ errors.insuranceRate }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Apport (€)
              </label>
              <Input
                v-model.number="parameters.downPayment"
                type="number"
                placeholder="50000"
                :variant="errors.downPayment ? 'error' : 'default'"
              />
              <p v-if="errors.downPayment" class="text-red-500 text-xs mt-1">
                {{ errors.downPayment }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Valeur du bien (€)
              </label>
              <Input
                v-model.number="parameters.propertyValue"
                type="number"
                placeholder="300000"
                :variant="errors.propertyValue ? 'error' : 'default'"
              />
              <p v-if="errors.propertyValue" class="text-red-500 text-xs mt-1">
                {{ errors.propertyValue }}
              </p>
            </div>
          </div>
        </div>

        <!-- Étape 3: Frais et options -->
        <div v-if="currentStep === 3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Frais et options avancées
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Frais de notaire (%)
              </label>
              <Input
                v-model.number="parameters.notaryFees"
                type="number"
                step="0.01"
                placeholder="2.5"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Frais d'agence (%)
              </label>
              <Input
                v-model.number="parameters.agencyFees"
                type="number"
                step="0.01"
                placeholder="3.0"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Travaux (€)
              </label>
              <Input
                v-model.number="parameters.travaux"
                type="number"
                placeholder="0"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Révalorisation annuelle du bien (%)
              </label>
              <Input
                v-model.number="parameters.revalorisationBien"
                type="number"
                step="0.01"
                placeholder="1.0"
              />
            </div>
          </div>
        </div>

        <!-- Étape 4: Nom et validation -->
        <div v-if="currentStep === 4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Finalisation
          </h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nom de la simulation
              </label>
              <Input
                v-model="simulationName"
                placeholder="Simulation immobilière 2024"
                :variant="errors.simulationName ? 'error' : 'default'"
              />
              <p v-if="errors.simulationName" class="text-red-500 text-xs mt-1">
                {{ errors.simulationName }}
              </p>
            </div>

            <!-- Résumé -->
            <div class="bg-gray-50 p-4 rounded-md">
              <h4 class="font-medium text-gray-900 mb-2">Résumé de la simulation :</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium">Client :</span> {{ selectedClient?.fullName }}
                </div>
                <div>
                  <span class="font-medium">Montant :</span> {{ formatCurrency(parameters.loanAmount) }}
                </div>
                <div>
                  <span class="font-medium">Durée :</span> {{ parameters.duration }} ans
                </div>
                <div>
                  <span class="font-medium">Taux :</span> {{ parameters.interestRate }}%
                </div>
              </div>
            </div>

            <!-- Calcul prévisionnel -->
            <div class="bg-blue-50 p-4 rounded-md">
              <h4 class="font-medium text-blue-900 mb-2">Estimation prévisionnelle :</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium">Mensualité :</span> {{ formatCurrency(previewResults.monthlyPayment) }}
                </div>
                <div>
                  <span class="font-medium">Coût total :</span> {{ formatCurrency(previewResults.totalCost) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Erreur générale -->
        <div v-if="errorMessage" class="mt-4 rounded-md bg-red-50 p-4">
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex justify-between">
          <Button
            v-if="currentStep > 1"
            @click="previousStep"
            variant="outline"
          >
            Précédent
          </Button>

          <div class="flex space-x-3 ml-auto">
            <Button
              v-if="currentStep < steps.length"
              @click="nextStep"
              :disabled="!canProceed"
            >
              Suivant
            </Button>

            <Button
              v-if="currentStep === steps.length"
              @click="createSimulation"
              :disabled="isCreating || !simulationName.trim()"
            >
              <span v-if="isCreating">Création en cours...</span>
              <span v-else>Créer la simulation</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useClientStore } from '@/stores/client'
import { useSimulationStore } from '@/stores/simulation'
import { useAuthStore } from '@/stores/auth'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import type { SimulationParameters } from '@/types'

const router = useRouter()
const clientStore = useClientStore()
const simulationStore = useSimulationStore()
const authStore = useAuthStore()

const currentStep = ref(1)
const selectedClientId = ref('')
const simulationName = ref('')
const isLoadingClients = ref(false)
const isCreating = ref(false)
const errorMessage = ref('')

const steps = [
  { id: 1, title: 'Client' },
  { id: 2, title: 'Prêt' },
  { id: 3, title: 'Frais' },
  { id: 4, title: 'Validation' },
]

const parameters = ref<SimulationParameters>({
  loanAmount: 250000,
  duration: 25,
  interestRate: 3.5,
  insuranceRate: 0.3,
  downPayment: 50000,
  notaryFees: 2.5,
  agencyFees: 3.0,
  propertyValue: 300000,
  travaux: 0,
  revalorisationBien: 1.0,
})

const errors = ref({
  loanAmount: '',
  interestRate: '',
  insuranceRate: '',
  downPayment: '',
  propertyValue: '',
  simulationName: '',
})

const clients = computed(() => clientStore.clients)

const selectedClient = computed(() => {
  return clients.value.find(client => client.id === parseInt(selectedClientId.value))
})

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return !!selectedClientId.value
    case 2:
      return parameters.value.loanAmount > 0 &&
             parameters.value.interestRate >= 0 &&
             parameters.value.insuranceRate >= 0 &&
             parameters.value.downPayment >= 0 &&
             parameters.value.propertyValue > 0
    case 3:
      return true
    case 4:
      return !!simulationName.value.trim()
    default:
      return false
  }
})

const previewResults = computed(() => {
  return simulationStore.calculatePreview(parameters.value)
})

onMounted(async () => {
  isLoadingClients.value = true
  try {
    await clientStore.fetchClients()
  } catch (error) {
    console.error('Erreur lors du chargement des clients:', error)
  } finally {
    isLoadingClients.value = false
  }
})

// Validation en temps réel
watch(() => parameters.value, () => {
  validateCurrentStep()
}, { deep: true })

const validateCurrentStep = () => {
  // Reset errors
  Object.keys(errors.value).forEach(key => {
    (errors.value as any)[key] = ''
  })

  if (currentStep.value === 2) {
    if (parameters.value.loanAmount <= 0) {
      errors.value.loanAmount = 'Le montant doit être supérieur à 0'
    }
    if (parameters.value.interestRate < 0) {
      errors.value.interestRate = 'Le taux ne peut pas être négatif'
    }
    if (parameters.value.insuranceRate < 0) {
      errors.value.insuranceRate = 'Le taux d\'assurance ne peut pas être négatif'
    }
    if (parameters.value.downPayment < 0) {
      errors.value.downPayment = 'L\'apport ne peut pas être négatif'
    }
    if (parameters.value.propertyValue <= 0) {
      errors.value.propertyValue = 'La valeur du bien doit être supérieure à 0'
    }
  }
}

const nextStep = () => {
  if (canProceed.value && currentStep.value < steps.length) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const createSimulation = async () => {
  if (!selectedClient.value || !simulationName.value.trim()) {
    return
  }

  isCreating.value = true
  errorMessage.value = ''

  try {
    const simulationData = {
      name: simulationName.value,
      clientId: selectedClient.value.id,
      parameters: parameters.value,
    }

    const newSimulation = await simulationStore.createSimulation(simulationData)

    // Rediriger vers la page de détails de la simulation
    router.push(`/simulations/${newSimulation.id}`)
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la création de la simulation'
  } finally {
    isCreating.value = false
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}
</script>
