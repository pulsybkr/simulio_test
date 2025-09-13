import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Client } from '@/types'
import { clientService } from '@/services/client'

export const useClientStore = defineStore('client', () => {
  const clients = ref<Client[]>([])
  const currentClient = ref<Client | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchClients() {
    isLoading.value = true
    error.value = null

    try {
      const data = await clientService.getClients()
      clients.value = data
    } catch (err) {
      error.value = 'Erreur lors du chargement des clients'
      console.error('Erreur fetchClients:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchClient(id: number) {
    isLoading.value = true
    error.value = null

    try {
      const data = await clientService.getClient(id)
      currentClient.value = data
      return data
    } catch (err) {
      error.value = 'Erreur lors du chargement du client'
      console.error('Erreur fetchClient:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createClient(data: {
    firstName: string
    lastName: string
    email?: string
    phone?: string
    address?: string
    assignedAgentId?: number
    password?: string
  }) {
    isLoading.value = true
    error.value = null

    try {
      const newClient = await clientService.createClient(data)
      clients.value.unshift(newClient) // Ajouter au début de la liste
      return newClient
    } catch (err) {
      error.value = 'Erreur lors de la création du client'
      console.error('Erreur createClient:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateClient(id: number, data: Partial<{
    firstName: string
    lastName: string
    email?: string
    phone?: string
    address?: string
    assignedAgentId?: number
  }>) {
    isLoading.value = true
    error.value = null

    try {
      const updatedClient = await clientService.updateClient(id, data)

      // Mettre à jour dans la liste
      const index = clients.value.findIndex(c => c.id === id)
      if (index !== -1) {
        clients.value[index] = updatedClient
      }

      if (currentClient.value?.id === id) {
        currentClient.value = updatedClient
      }

      return updatedClient
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour du client'
      console.error('Erreur updateClient:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteClient(id: number) {
    isLoading.value = true
    error.value = null

    try {
      await clientService.deleteClient(id)

      // Retirer de la liste
      clients.value = clients.value.filter(c => c.id !== id)

      if (currentClient.value?.id === id) {
        currentClient.value = null
      }
    } catch (err) {
      error.value = 'Erreur lors de la suppression du client'
      console.error('Erreur deleteClient:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function setCurrentClient(client: Client | null) {
    currentClient.value = client
  }

  return {
    // State
    clients,
    currentClient,
    isLoading,
    error,

    // Actions
    fetchClients,
    fetchClient,
    createClient,
    updateClient,
    deleteClient,
    clearError,
    setCurrentClient,
  }
})
