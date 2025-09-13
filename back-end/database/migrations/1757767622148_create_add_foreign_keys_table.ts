import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'add_foreign_keys'

  async up() {
    // Ajouter les contraintes de clés étrangères
    this.schema.alterTable('auth_access_tokens', (table) => {
      table.foreign('tokenable_id').references('id').inTable('users').onDelete('CASCADE')
    })

    this.schema.alterTable('clients', (table) => {
      table.foreign('assigned_agent_id').references('id').inTable('users').onDelete('SET NULL')
    })
  }

  async down() {
    // Supprimer les contraintes de clés étrangères
    this.schema.alterTable('auth_access_tokens', (table) => {
      table.dropForeign(['tokenable_id'])
    })

    this.schema.alterTable('clients', (table) => {
      table.dropForeign(['assigned_agent_id'])
    })
  }
}