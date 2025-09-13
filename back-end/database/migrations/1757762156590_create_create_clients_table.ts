import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('email', 255).nullable()
      table.string('phone', 20).nullable()
      table.text('address').nullable()
      table.integer('assigned_agent_id').unsigned().nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    // Pas de contrainte FK pour l'instant - sera ajoutée manuellement
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}