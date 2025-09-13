import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Client from '#models/client'

export interface SimulationParameters {
  loanAmount: number
  duration: number // en années
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

export interface SimulationResults {
  monthlyPayment: number
  totalInterest: number
  totalInsurance: number
  totalCost: number
  amortizationTable: Array<{
    period: number
    date: string
    payment: number
    principal: number
    interest: number
    balance: number
  }>
  propertyValueEvolution: Array<{
    year: number
    value: number
    remainingCapital: number
    netEquity: number
  }>
  salaryRequirement: number
}

export default class Simulation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare clientId: number | null

  @column()
  declare createdById: number

  @column()
  declare parameters: string

  @column()
  declare results: string | null

  @column()
  declare status: 'pending' | 'processing' | 'completed' | 'failed'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relations
  @belongsTo(() => Client, {
    foreignKey: 'clientId',
  })
  declare client: BelongsTo<typeof Client>

  @belongsTo(() => User, {
    foreignKey: 'createdById',
  })
  declare createdBy: BelongsTo<typeof User>

  // Computed properties
  get isCompleted(): boolean {
    return this.status === 'completed'
  }

  get isFailed(): boolean {
    return this.status === 'failed'
  }

  get isProcessing(): boolean {
    return this.status === 'processing'
  }
}