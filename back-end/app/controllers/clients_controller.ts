import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'
import User from '#models/user'
import { createClientValidator, updateClientValidator } from '#validators/client'

export default class ClientsController {
  async index({ response, auth }: HttpContext) {
    try {
      const user = auth.user!

      let query = Client.query()
        .preload('assignedAgent')
        .preload('simulations')

      if (user.role === 'client') {
        return response.forbidden({
          message: 'Accès refusé',
        })
      } else if (user.role === 'agent') {
        query = query.where('assignedAgentId', user.id)
      }

      const clients = await query.orderBy('createdAt', 'desc')

      return response.ok({
        clients: clients.map(client => ({
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          address: client.address,
          assignedAgent: client.assignedAgent ? {
            id: client.assignedAgent.id,
            firstName: client.assignedAgent.firstName,
            lastName: client.assignedAgent.lastName,
            fullName: client.assignedAgent.fullName,
          } : null,
          simulationsCount: client.simulations.length,
          createdAt: client.createdAt,
          fullName: client.fullName,
        })),
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de la récupération des clients',
        error: error.message,
      })
    }
  }

  async store({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const payload = await request.validateUsing(createClientValidator)

      if (user.role === 'client') {
        return response.forbidden({
          message: 'Vous n\'avez pas les permissions pour créer un client',
        })
      }

      if (user.role === 'agent' && payload.assignedAgentId && payload.assignedAgentId !== user.id) {
        return response.forbidden({
          message: 'Vous ne pouvez assigner des clients qu\'à vous-même',
        })
      }

      const existingUser = await User.findBy('email', payload.email)
      const existingClient = await Client.findBy('email', payload.email)
      if (existingUser || existingClient) {
        return response.badRequest({
          message: 'Cet email est déjà utilisé par un autre utilisateur ou client',
        })
      }

      const client = await Client.create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        assignedAgentId: payload.assignedAgentId || (user.role === 'agent' ? user.id : null),
      })

      let userAccount = null
      if (payload.password && payload.email) {
        try {
          userAccount = await User.create({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            password: payload.password,
            role: 'client',
            isActive: true,
          })
        } catch (userError) {
          await client.delete()
          throw new Error('Erreur lors de la création du compte utilisateur: ' + userError.message)
        }
      }

      await client.load('assignedAgent')

      return response.created({
        message: userAccount ? 'Client et compte utilisateur créés avec succès' : 'Client créé avec succès',
        client: {
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          address: client.address,
          assignedAgent: client.assignedAgent,
          createdAt: client.createdAt,
          fullName: client.fullName,
        },
        userAccount: userAccount ? {
          id: userAccount.id,
          email: userAccount.email,
          role: userAccount.role,
        } : null,
      })
    } catch (error) {
      console.error('Erreur création client:', error)
      
      if (error.messages) {
        return response.badRequest({
          message: 'Données invalides',
          errors: error.messages,
        })
      }
      
      if (error.code === 'ER_DUP_ENTRY' || error.constraint) {
        return response.badRequest({
          message: 'Un client avec cet email existe déjà',
        })
      }
      
      return response.badRequest({
        message: error.message || 'Erreur lors de la création du client',
      })
    }
  }

  async show({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const client = await Client.query()
        .where('id', params.id)
        .preload('assignedAgent')
        .preload('simulations', (query) => {
          query.preload('createdBy')
        })
        .first()

      if (!client) {
        return response.notFound({
          message: 'Client non trouvé',
        })
      }

      if (user.role === 'agent' && client.assignedAgentId !== user.id) {
        return response.forbidden({
          message: 'Vous n\'avez pas accès à ce client',
        })
      }

      return response.ok({
        client: {
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          address: client.address,
          assignedAgent: client.assignedAgent,
          simulations: client.simulations.map(simulation => ({
            id: simulation.id,
            name: simulation.name,
            status: simulation.status,
            createdAt: simulation.createdAt,
            createdBy: simulation.createdBy,
          })),
          createdAt: client.createdAt,
          fullName: client.fullName,
        },
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de la récupération du client',
        error: error.message,
      })
    }
  }

  async update({ params, request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const payload = await request.validateUsing(updateClientValidator)

      const client = await Client.find(params.id)

      if (!client) {
        return response.notFound({
          message: 'Client non trouvé',
        })
      }

      if (user.role === 'agent' && client.assignedAgentId !== user.id) {
        return response.forbidden({
          message: 'Vous n\'avez pas les permissions pour modifier ce client',
        })
      }

      if (user.role === 'agent' && payload.assignedAgentId && payload.assignedAgentId !== user.id) {
        return response.forbidden({
          message: 'Vous ne pouvez pas réassigner ce client',
        })
      }

      client.merge(payload)
      await client.save()
      await client.load('assignedAgent')

      return response.ok({
        message: 'Client mis à jour avec succès',
        client: {
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          address: client.address,
          assignedAgent: client.assignedAgent,
          fullName: client.fullName,
        },
      })
    } catch (error) {
      return response.badRequest({
        message: 'Erreur lors de la mise à jour du client',
        errors: error.messages || [error.message],
      })
    }
  }

  async destroy({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user!

      if (user.role !== 'admin') {
        return response.forbidden({
          message: 'Vous n\'avez pas les permissions pour supprimer un client',
        })
      }

      const client = await Client.find(params.id)

      if (!client) {
        return response.notFound({
          message: 'Client non trouvé',
        })
      }

      await client.delete()

      return response.ok({
        message: 'Client supprimé avec succès',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de la suppression du client',
        error: error.message,
      })
    }
  }
}