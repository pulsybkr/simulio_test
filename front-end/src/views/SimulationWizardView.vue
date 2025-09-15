<template>
  <div class="p-6">

    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            Nouvelle Simulation
          </h1>
          <p class="mt-2 text-gray-600">
            Créez une simulation financière personnalisée
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

      <div class="flex items-center space-x-4 overflow-x-auto pb-2">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="flex items-center space-x-2 whitespace-nowrap"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
            :class="{
              'bg-indigo-600 text-white': step.id === currentStep,
              'bg-green-600 text-white': step.id < currentStep,
              'bg-gray-200 text-gray-600': step.id > currentStep
            }"
          >
            <span v-if="step.id < currentStep">✓</span>
            <span v-else>{{ step.id }}</span>
          </div>
          <span
            class="text-sm font-medium transition-colors"
            :class="{
              'text-indigo-600': step.id === currentStep,
              'text-green-600': step.id < currentStep,
              'text-gray-500': step.id > currentStep
            }"
          >
            {{ step.title }}
          </span>
          <div
            v-if="index < steps.length - 1"
            class="w-8 h-0.5 mx-2"
            :class="{
              'bg-indigo-600': step.id < currentStep,
              'bg-gray-200': step.id >= currentStep
            }"
          />
        </div>
      </div>

    <Card class="p-6">
      <div v-if="currentStep === 1">
        <h3 class="text-lg font-medium text-gray-900 mb-6 text-center">
          Quel est le montant de votre prêt ?
        </h3>

        <div class="max-w-md mx-auto">
          <PriceSlider
            v-model="parameters.loanAmount"
            label="Montant du prêt"
            :min="50000"
            :max="1000000"
            :step="5000"
            :shortcuts="[
              { label: '100k€', value: 100000 },
              { label: '200k€', value: 200000 },
              { label: '300k€', value: 300000 },
              { label: '500k€', value: 500000 }
            ]"
          />
        </div>
      </div>

      <div v-if="currentStep === 2">
        <h3 class="text-lg font-medium text-gray-900 mb-6 text-center">
          Sur combien d'années souhaitez-vous emprunter ?
        </h3>

        <div class="max-w-md mx-auto">
          <div class="text-center mb-6">
            <div class="text-3xl font-bold text-indigo-600">
              {{ parameters.duration }} ans
            </div>
            <div class="text-sm text-gray-500 mt-1">
              Durée du prêt
            </div>
          </div>

          <input
            v-model.number="parameters.duration"
            type="range"
            min="10"
            max="30"
            step="5"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          
          <div class="flex justify-between text-xs text-gray-400 mt-2">
            <span>10 ans</span>
            <span>30 ans</span>
          </div>

          <div class="flex flex-wrap gap-2 justify-center mt-4">
            <button
              v-for="duration in [10, 15, 20, 25, 30]"
              :key="duration"
              @click="parameters.duration = duration"
              :class="[
                'px-3 py-1 text-xs rounded-full border transition-colors',
                parameters.duration === duration
                  ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              ]"
            >
              {{ duration }} ans
            </button>
          </div>
        </div>
      </div>

        
      <div v-if="currentStep === 3">
        <h3 class="text-lg font-medium text-gray-900 mb-6 text-center">
          Quel est votre taux d'intérêt ?
        </h3>

        <div class="max-w-md mx-auto">
          <div class="text-center mb-6">
            <div class="text-3xl font-bold text-indigo-600">
              {{ parameters.interestRate }}%
            </div>
            <div class="text-sm text-gray-500 mt-1">
              Taux d'intérêt annuel
            </div>
          </div>

          <input
            v-model.number="parameters.interestRate"
            type="range"
            min="0.5"
            max="6"
            step="0.1"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          
          <div class="flex justify-between text-xs text-gray-400 mt-2">
            <span>0.5%</span>
            <span>6%</span>
          </div>

          <div class="flex flex-wrap gap-2 justify-center mt-4">
            <button
              v-for="rate in [1.5, 2.0, 2.5, 3.0, 3.5, 4.0]"
              :key="rate"
              @click="parameters.interestRate = rate"
              :class="[
                'px-3 py-1 text-xs rounded-full border transition-colors',
                parameters.interestRate === rate
                  ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              ]"
            >
              {{ rate }}%
            </button>
          </div>
        </div>
      </div>

        
      <div v-if="currentStep === 4">
        <h3 class="text-lg font-medium text-gray-900 mb-6 text-center">
          Quel est votre taux d'assurance emprunteur ?
        </h3>

        <div class="max-w-md mx-auto">
          <div class="text-center mb-6">
            <div class="text-3xl font-bold text-indigo-600">
              {{ parameters.insuranceRate }}%
            </div>
            <div class="text-sm text-gray-500 mt-1">
              Taux d'assurance annuel
            </div>
          </div>

          <input
            v-model.number="parameters.insuranceRate"
            type="range"
            min="0"
            max="1.5"
            step="0.05"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          
          <div class="flex justify-between text-xs text-gray-400 mt-2">
            <span>0%</span>
            <span>1.5%</span>
          </div>

          <div class="flex flex-wrap gap-2 justify-center mt-4">
            <button
              v-for="rate in [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]"
              :key="rate"
              @click="parameters.insuranceRate = rate"
              :class="[
                'px-3 py-1 text-xs rounded-full border transition-colors',
                parameters.insuranceRate === rate
                  ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              ]"
            >
              {{ rate }}%
            </button>
          </div>
        </div>
      </div>

        
      <div v-if="currentStep === 5">
        <h3 class="text-lg font-medium text-gray-900 mb-6 text-center">
          Quel est le montant de votre apport ?
        </h3>

        <div class="max-w-md mx-auto">
          <PriceSlider
            v-model="parameters.downPayment"
            label="Apport personnel"
            :min="0"
            :max="Math.floor(parameters.loanAmount * 0.5)"
            :step="1000"
            :shortcuts="[
              { label: '0€', value: 0 },
              { label: '10%', value: Math.floor(parameters.loanAmount * 0.1) },
              { label: '20%', value: Math.floor(parameters.loanAmount * 0.2) },
              { label: '30%', value: Math.floor(parameters.loanAmount * 0.3) }
            ]"
          />
        </div>
      </div>

        
      <div v-if="currentStep === 6">
        <h3 class="text-lg font-medium text-gray-900 mb-6 text-center">
          Quelle est la valeur du bien immobilier ?
        </h3>

        <div class="max-w-md mx-auto">
          <PriceSlider
            v-model="parameters.propertyValue"
            label="Valeur du bien"
            :min="100000"
            :max="2000000"
            :step="10000"
            :shortcuts="[
              { label: '200k€', value: 200000 },
              { label: '300k€', value: 300000 },
              { label: '500k€', value: 500000 },
              { label: '750k€', value: 750000 },
              { label: '1M€', value: 1000000 }
            ]"
          />
        </div>
      </div>

        
      <div v-if="currentStep === 7">
        <h3 class="text-lg font-medium text-gray-900 mb-6 text-center">
          Quels sont les frais associés ?
        </h3>

        <div class="max-w-md mx-auto space-y-6">
            
          <div>
            <div class="text-center mb-4">
              <div class="text-2xl font-bold text-indigo-600">
                {{ parameters.notaryFees }}%
              </div>
              <div class="text-sm text-gray-500">
                Frais de notaire
              </div>
            </div>

            <input
              v-model.number="parameters.notaryFees"
              type="range"
              min="1"
              max="8"
              step="0.1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            
            <div class="flex justify-between text-xs text-gray-400 mt-2">
              <span>1%</span>
              <span>8%</span>
            </div>

            <div class="flex flex-wrap gap-2 justify-center mt-2">
              <button
                v-for="fee in [2.0, 2.5, 3.0, 3.5, 4.0]"
                :key="fee"
                @click="parameters.notaryFees = fee"
                :class="[
                  'px-2 py-1 text-xs rounded-full border transition-colors',
                  parameters.notaryFees === fee
                    ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                ]"
              >
                {{ fee }}%
              </button>
            </div>
          </div>

            
          <div>
            <div class="text-center mb-4">
              <div class="text-2xl font-bold text-green-600">
                {{ parameters.agencyFees }}%
              </div>
              <div class="text-sm text-gray-500">
                Frais d'agence
              </div>
            </div>

            <input
              v-model.number="parameters.agencyFees"
              type="range"
              min="0"
              max="10"
              step="0.1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            
            <div class="flex justify-between text-xs text-gray-400 mt-2">
              <span>0%</span>
              <span>10%</span>
            </div>

            <div class="flex flex-wrap gap-2 justify-center mt-2">
              <button
                v-for="fee in [0, 2.0, 3.0, 4.0, 5.0]"
                :key="fee"
                @click="parameters.agencyFees = fee"
                :class="[
                  'px-2 py-1 text-xs rounded-full border transition-colors',
                  parameters.agencyFees === fee
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                ]"
              >
                {{ fee }}%
              </button>
            </div>
          </div>
        </div>
      </div>

        
      <div v-if="currentStep === 8">
        <h3 class="text-lg font-medium text-gray-900 mb-6 text-center">
          Options avancées (optionnel)
        </h3>

        <div class="max-w-md mx-auto space-y-6">
            
          <div>
            <PriceSlider
              v-model="parameters.travaux"
              label="Montant des travaux"
              :min="0"
              :max="200000"
              :step="1000"
              :shortcuts="[
                { label: '0€', value: 0 },
                { label: '10k€', value: 10000 },
                { label: '25k€', value: 25000 },
                { label: '50k€', value: 50000 },
                { label: '100k€', value: 100000 }
              ]"
            />
          </div>

            
          <div>
            <div class="text-center mb-4">
              <div class="text-2xl font-bold text-purple-600">
                {{ parameters.revalorisationBien }}%
              </div>
              <div class="text-sm text-gray-500">
                Revalorisation annuelle du bien
              </div>
            </div>

            <input
              v-model.number="parameters.revalorisationBien"
              type="range"
              min="-2"
              max="5"
              step="0.1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            
            <div class="flex justify-between text-xs text-gray-400 mt-2">
              <span>-2%</span>
              <span>5%</span>
            </div>

            <div class="flex flex-wrap gap-2 justify-center mt-2">
              <button
                v-for="rate in [0, 0.5, 1.0, 1.5, 2.0, 2.5]"
                :key="rate"
                @click="parameters.revalorisationBien = rate"
                :class="[
                  'px-2 py-1 text-xs rounded-full border transition-colors',
                  parameters.revalorisationBien === rate
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                ]"
              >
                {{ rate }}%
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentStep === 9">
        <h3 class="text-lg font-medium text-gray-900 mb-6 text-center">
          Prévisualisation de votre simulation
        </h3>

        <div class="max-w-2xl mx-auto space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nom de la simulation
            </label>
            <Input
              v-model="simulationName"
              placeholder="Ma simulation immobilière"
              :variant="errors.simulationName ? 'error' : 'default'"
              class="text-center"
            />
            <p v-if="errors.simulationName" class="text-red-500 text-xs mt-1 text-center">
              {{ errors.simulationName }}
            </p>
          </div>

          <div class="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-4 text-center">Vos paramètres</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div class="text-center">
                <div class="font-medium text-gray-600">Montant prêt</div>
                <div class="text-lg font-bold text-indigo-600">{{ formatCurrency(parameters.loanAmount) }}</div>
              </div>
              <div class="text-center">
                <div class="font-medium text-gray-600">Durée</div>
                <div class="text-lg font-bold text-indigo-600">{{ parameters.duration }} ans</div>
              </div>
              <div class="text-center">
                <div class="font-medium text-gray-600">Taux d'intérêt</div>
                <div class="text-lg font-bold text-indigo-600">{{ parameters.interestRate }}%</div>
              </div>
              <div class="text-center">
                <div class="font-medium text-gray-600">Assurance</div>
                <div class="text-lg font-bold text-indigo-600">{{ parameters.insuranceRate }}%</div>
              </div>
              <div class="text-center">
                <div class="font-medium text-gray-600">Apport</div>
                <div class="text-lg font-bold text-indigo-600">{{ formatCurrency(parameters.downPayment) }}</div>
              </div>
              <div class="text-center">
                <div class="font-medium text-gray-600">Valeur bien</div>
                <div class="text-lg font-bold text-indigo-600">{{ formatCurrency(parameters.propertyValue) }}</div>
              </div>
              <div class="text-center">
                <div class="font-medium text-gray-600">Frais notaire</div>
                <div class="text-lg font-bold text-indigo-600">{{ parameters.notaryFees }}%</div>
              </div>
              <div class="text-center">
                <div class="font-medium text-gray-600">Frais agence</div>
                <div class="text-lg font-bold text-indigo-600">{{ parameters.agencyFees }}%</div>
              </div>
              <div v-if="parameters.travaux > 0" class="text-center">
                <div class="font-medium text-gray-600">Travaux</div>
                <div class="text-lg font-bold text-indigo-600">{{ formatCurrency(parameters.travaux) }}</div>
              </div>
              <div class="text-center">
                <div class="font-medium text-gray-600">Revalorisation</div>
                <div class="text-lg font-bold text-indigo-600">{{ parameters.revalorisationBien }}%</div>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-4 text-center">Estimation prévisionnelle</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="text-center">
                <div class="font-medium text-gray-600">Mensualité</div>
                <div class="text-2xl font-bold text-green-600">{{ formatCurrency(previewResults.monthlyPayment) }}</div>
              </div>
              <div class="text-center">
                <div class="font-medium text-gray-600">Coût total</div>
                <div class="text-2xl font-bold text-green-600">{{ formatCurrency(previewResults.totalCost) }}</div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 justify-center">
            <button
              @click="currentStep = 1"
              class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            >
              Montant
            </button>
            <button
              @click="currentStep = 2"
              class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            >
              Durée
            </button>
            <button
              @click="currentStep = 3"
              class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            >
              Taux
            </button>
            <button
              @click="currentStep = 4"
              class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            >
              Assurance
            </button>
            <button
              @click="currentStep = 5"
              class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            >
              Apport
            </button>
            <button
              @click="currentStep = 6"
              class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            >
              Valeur bien
            </button>
            <button
              @click="currentStep = 7"
              class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            >
              Frais
            </button>
            <button
              @click="currentStep = 8"
              class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            >
              Options
            </button>
          </div>
        </div>
      </div>

      <div v-if="errorMessage" class="mt-4 rounded-md bg-red-50 p-4">
        <p class="text-sm text-red-700">{{ errorMessage }}</p>
      </div>

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
            class="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
          >
            <span v-if="isCreating">Création en cours...</span>
            <span v-else>🚀 Créer la simulation</span>
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSimulationStore } from '@/stores/simulation'
import { useAuthStore } from '@/stores/auth'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import PriceSlider from '@/components/ui/PriceSlider.vue'
import type { SimulationParameters } from '@/types'

const router = useRouter()
const simulationStore = useSimulationStore()
const authStore = useAuthStore()

const currentStep = ref(1)
const simulationName = ref('')
const isCreating = ref(false)
const errorMessage = ref('')

const steps = [
  { id: 1, title: 'Montant' },
  { id: 2, title: 'Durée' },
  { id: 3, title: 'Taux' },
  { id: 4, title: 'Assurance' },
  { id: 5, title: 'Apport' },
  { id: 6, title: 'Valeur bien' },
  { id: 7, title: 'Frais' },
  { id: 8, title: 'Options' },
  { id: 9, title: 'Validation' },
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

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return parameters.value.loanAmount > 0
    case 2:
      return parameters.value.duration > 0
    case 3:
      return parameters.value.interestRate >= 0
    case 4:
      return parameters.value.insuranceRate >= 0
    case 5:
      return parameters.value.downPayment >= 0
    case 6:
      return parameters.value.propertyValue > 0
    case 7:
      return parameters.value.notaryFees >= 0 && parameters.value.agencyFees >= 0
    case 8:
      return true 
    case 9:
      return !!simulationName.value.trim()
    default:
      return false
  }
})

const previewResults = computed(() => {
  return simulationStore.calculatePreview(parameters.value)
})


watch(() => parameters.value, () => {
  validateCurrentStep()
}, { deep: true })

const validateCurrentStep = () => {
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
  if (!simulationName.value.trim() || isCreating.value) {
    return
  }

  isCreating.value = true
  errorMessage.value = ''

  try {
    const simulationData: any = {
      name: simulationName.value,
      parameters: parameters.value,
    }

    if (!authStore.isClient) {
      simulationData.clientId = null 
    }

    const newSimulation = await simulationStore.createSimulation(simulationData)

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