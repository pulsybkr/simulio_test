import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'simulations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('name', 255).notNullable()
      table.integer('client_id').unsigned().nullable().references('id').inTable('clients').onDelete('CASCADE')
      table.integer('created_by_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      // Paramètres de la simulation
      table.text('parameters').notNullable()

      // Résultats de la simulation
      table.text('results').nullable()

      // Statut de la simulation
      table.enum('status', ['pending', 'processing', 'completed', 'failed']).defaultTo('pending')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}