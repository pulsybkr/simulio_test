import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Simulation, SimulationParameters } from '@/types'
import { simulationService } from '@/services/simulation'

export const useSimulationStore = defineStore('simulation', () => {
  const simulations = ref<Simulation[]>([])
  const currentSimulation = ref<Simulation | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchSimulations(clientId?: number) {
    isLoading.value = true
    error.value = null

    try {
      const data = await simulationService.getSimulations(clientId)
      console.log('data', data)
      simulations.value = data
    } catch (err) {
      error.value = 'Erreur lors du chargement des simulations'
      console.error('Erreur fetchSimulations:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchSimulation(id: number) {
    isLoading.value = true
    error.value = null

    try {
      const data = await simulationService.getSimulation(id)
      currentSimulation.value = data
      return data
    } catch (err) {
      error.value = 'Erreur lors du chargement de la simulation'
      console.error('Erreur fetchSimulation:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createSimulation(data: {
    name: string
    clientId: number
    parameters: SimulationParameters
  }) {
    isLoading.value = true
    error.value = null

    try {
      const newSimulation = await simulationService.createSimulation(data)
      simulations.value.unshift(newSimulation) // Ajouter au début de la liste
      return newSimulation
    } catch (err) {
      error.value = 'Erreur lors de la création de la simulation'
      console.error('Erreur createSimulation:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateSimulation(id: number, data: Partial<{
    name: string
    clientId: number
    parameters: SimulationParameters
  }>) {
    isLoading.value = true
    error.value = null

    try {
      const updatedSimulation = await simulationService.updateSimulation(id, data)

      // Mettre à jour dans la liste
      const index = simulations.value.findIndex(s => s.id === id)
      if (index !== -1) {
        simulations.value[index] = updatedSimulation
      }

      if (currentSimulation.value?.id === id) {
        currentSimulation.value = updatedSimulation
      }

      return updatedSimulation
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour de la simulation'
      console.error('Erreur updateSimulation:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteSimulation(id: number) {
    isLoading.value = true
    error.value = null

    try {
      await simulationService.deleteSimulation(id)

      // Retirer de la liste
      simulations.value = simulations.value.filter(s => s.id !== id)

      if (currentSimulation.value?.id === id) {
        currentSimulation.value = null
      }
    } catch (err) {
      error.value = 'Erreur lors de la suppression de la simulation'
      console.error('Erreur deleteSimulation:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function setCurrentSimulation(simulation: Simulation | null) {
    currentSimulation.value = simulation
  }

  // Calcul local pour prévisualisation
  function calculatePreview(params: SimulationParameters) {
    return simulationService.calculateSimulationLocally(params)
  }

  return {
    // State
    simulations,
    currentSimulation,
    isLoading,
    error,

    // Actions
    fetchSimulations,
    fetchSimulation,
    createSimulation,
    updateSimulation,
    deleteSimulation,
    clearError,
    setCurrentSimulation,
    calculatePreview,
  }
})
