import api from './api'
import type { Client, ClientForm } from '@/types'

class ClientService {
  async getClients(): Promise<Client[]> {
    const response = await api.get('/clients')
    return response.data.clients
  }

  async getClient(id: number): Promise<Client> {
    const response = await api.get(`/clients/${id}`)
    return response.data.client
  }

  async createClient(data: ClientForm): Promise<Client> {
    const response = await api.post('/clients', data)
    return response.data.client
  }

  async updateClient(id: number, data: Partial<ClientForm>): Promise<Client> {
    const response = await api.put(`/clients/${id}`, data)
    return response.data.client
  }

  async deleteClient(id: number): Promise<void> {
    await api.delete(`/clients/${id}`)
  }

  // Récupérer les clients assignés à l'agent actuel
  async getMyClients(): Promise<Client[]> {
    const response = await api.get('/clients')
    return response.data.clients
  }
}

export const clientService = new ClientService()
