// Types pour l'authentification
export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'agent' | 'client'
  fullName: string
  isActive: boolean
  createdAt: string
}

// Types pour les clients
export interface Client {
  id: number
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  address: string | null
  assignedAgentId: number | null
  assignedAgent?: {
    id: number
    firstName: string
    lastName: string
    fullName: string
  }
  simulationsCount?: number
  fullName: string
  createdAt: string
}

// Types pour les simulations
export interface SimulationParameters {
  loanAmount: number
  duration: number
  interestRate: number
  insuranceRate: number
  downPayment: number
  notaryFees: number
  agencyFees: number
  propertyValue: number
  monthlyIncome?: number
  monthlyCharges?: number
  travaux?: number
  revalorisationBien?: number
}

export interface AmortizationEntry {
  period: number
  date: string
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface PropertyEvolutionEntry {
  year: number
  value: number
  remainingCapital: number
  netEquity: number
}

export interface SimulationResults {
  monthlyPayment: number
  totalInterest: number
  totalInsurance: number
  totalCost: number
  amortizationTable: AmortizationEntry[]
  propertyValueEvolution: PropertyEvolutionEntry[]
  salaryRequirement: number
}

export interface Simulation {
  id: number
  name: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  parameters: SimulationParameters
  results: SimulationResults | null
  client?: Client
  createdBy: User
  createdAt: string
  updatedAt: string
}

// Types pour les formulaires
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  password: string
  password_confirmation: string
  role?: 'admin' | 'agent' | 'client'
}

export interface ClientForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  assignedAgentId?: number
  password?: string
}

export interface SimulationForm {
  name: string
  clientId?: number
  parameters: SimulationParameters
}
