import api from './api'
import type {
  Simulation,
  SimulationParameters,
  SimulationResults,
  Client,
  SimulationForm
} from '@/types'

class SimulationService {
  async getSimulations(clientId?: number): Promise<Simulation[]> {
    const params = clientId ? { clientId } : {}
    const response = await api.get('/simulations', { params })
    return response.data.simulations
  }

  async getSimulation(id: number): Promise<Simulation> {
    const response = await api.get(`/simulations/${id}`)
    return response.data.simulation
  }

  async createSimulation(data: SimulationForm): Promise<Simulation> {
    const response = await api.post('/simulations', data)
    return response.data.simulation
  }

  async updateSimulation(id: number, data: Partial<SimulationForm>): Promise<Simulation> {
    const response = await api.put(`/simulations/${id}`, data)
    return response.data.simulation
  }

  async deleteSimulation(id: number): Promise<void> {
    await api.delete(`/simulations/${id}`)
  }

  // Méthode utilitaire pour calculer une simulation côté client (optionnel)
  calculateSimulationLocally(params: SimulationParameters): SimulationResults {
    // Calculs simplifiés côté client (pour la prévisualisation)
    const { loanAmount, duration, interestRate, insuranceRate, downPayment } = params

    // Montant financé
    const financedAmount = loanAmount - downPayment

    // Taux mensuel
    const monthlyRate = interestRate / 100 / 12

    // Nombre de mensualités
    const numPayments = duration * 12

    // Calcul de la mensualité (formule du prêt amortissable)
    const monthlyPayment = financedAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)

    // Assurance mensuelle
    const monthlyInsurance = financedAmount * (insuranceRate / 100) / 12

    // Total mensuel
    const totalMonthly = monthlyPayment + monthlyInsurance

    // Calcul du coût total
    const totalCost = totalMonthly * numPayments
    const totalInterest = totalCost - financedAmount - (monthlyInsurance * numPayments)

    return {
      monthlyPayment: Math.round(totalMonthly * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalInsurance: Math.round(monthlyInsurance * numPayments * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      amortizationTable: [], // À implémenter si nécessaire
      propertyValueEvolution: [], // À implémenter si nécessaire
      salaryRequirement: Math.round(totalMonthly * 100 / 35)
    }
  }
}

export const simulationService = new SimulationService()
