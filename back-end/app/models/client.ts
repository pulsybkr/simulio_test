import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Simulation from '#models/simulation'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string | null

  @column()
  declare phone: string | null

  @column()
  declare address: string | null

  @column()
  declare assignedAgentId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relations
  @belongsTo(() => User, {
    foreignKey: 'assignedAgentId',
  })
  declare assignedAgent: BelongsTo<typeof User>

  @hasMany(() => Simulation, {
    foreignKey: 'clientId',
  })
  declare simulations: HasMany<typeof Simulation>

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }
}