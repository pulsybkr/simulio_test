import type { HttpContext } from '@adonisjs/core/http'
import Simulation from '#models/simulation'
import Client from '#models/client'
import { createSimulationValidator, updateSimulationValidator } from '#validators/simulation'
import axios from 'axios'

export default class SimulationsController {
  async index({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const { clientId } = request.qs()

      let query = Simulation.query()
        .preload('client')
        .preload('createdBy')

      if (user.role === 'client') { 
        const client = await Client.findBy('email', user.email)
        if (client) {
          query = query.where('clientId', client.id)
        } else {
          return response.ok({ simulations: [] })
        }
      } else if (user.role === 'agent') {   
        const clientIds = await Client.query()
          .where('assignedAgentId', user.id)
          .select('id')
        
        if (clientIds.length > 0) {
          query = query.where((subQuery) => {
            subQuery.whereIn('clientId', clientIds.map(c => c.id))
                    .orWhereNull('clientId')
          })
        } else {
          query = query.whereNull('clientId')
        }
      }

      if (clientId) {
        query = query.where('clientId', clientId)
      }

      const simulations = await query
        .orderBy('createdAt', 'desc')
        .limit(50)

      return response.ok({
        simulations: simulations.map(simulation => {
          let parsedResults = null
          if (simulation.results) {
            try {
              const fullResults = JSON.parse(simulation.results)
              parsedResults = {
                monthlyPayment: fullResults.monthlyPayment,
                totalCost: fullResults.totalCost,
              }
            } catch (error) {
              console.error('Erreur parsing results dans index:', error)
            }
          }

          return {
            id: simulation.id,
            name: simulation.name,
            status: simulation.status,
            client: simulation.client ? {
              id: simulation.client.id,
              firstName: simulation.client.firstName,
              lastName: simulation.client.lastName,
              fullName: simulation.client.fullName,
            } : null,
            createdBy: {
              id: simulation.createdBy.id,
              firstName: simulation.createdBy.firstName,
              lastName: simulation.createdBy.lastName,
              fullName: simulation.createdBy.fullName,
            },
            createdAt: simulation.createdAt,
            results: parsedResults,
          }
        }),
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de la récupération des simulations',
        error: error.message,
      })
    }
  }


  async store({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      
      console.log('Données reçues du frontend:', request.body())
      const payload = await request.validateUsing(createSimulationValidator)
      console.log('Données validées:', payload)

      let clientId = payload.clientId

      if (user.role === 'client') {
        const client = await Client.findBy('email', user.email)
        if (!client) {
          return response.forbidden({
            message: 'Profil client non trouvé. Veuillez contacter votre agent.',
          })
        }
        clientId = client.id
      } else {
        if (clientId) {
          const client = await Client.find(clientId)

          if (!client) {
            return response.notFound({
              message: 'Client non trouvé',
            })
          }

          if (user.role === 'agent' && client.assignedAgentId !== user.id) {
            return response.forbidden({
              message: 'Vous n\'avez pas les permissions pour créer une simulation pour ce client',
            })
          }
        }
      }

      const simulation = new Simulation()
      simulation.name = payload.name
      simulation.clientId = clientId || null
      simulation.createdById = user.id
      simulation.parameters = JSON.stringify(payload.parameters)
      simulation.status = 'pending'
      await simulation.save()

      this.processSimulation(simulation.id)

      if (simulation.clientId) {
        await simulation.load('client')
      }
      await simulation.load('createdBy')

      let parsedParameters = null
      try {
        parsedParameters = JSON.parse(simulation.parameters)
      } catch (error) {
        console.error('Erreur parsing parameters dans store:', error)
      }

      return response.created({
        message: 'Simulation créée et calcul lancée',
        simulation: {
          id: simulation.id,
          name: simulation.name,
          status: simulation.status,
          parameters: parsedParameters,
          results: null,
          client: simulation.client,
          createdBy: simulation.createdBy,
          createdAt: simulation.createdAt,
        },
      })
    } catch (error) {
      return response.badRequest({
        message: 'Erreur lors de la création de la simulation',
        errors: error.messages || [error.message],
      })
    }
  }

  async show({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user!

      const simulation = await Simulation.query()
        .where('id', params.id)
        .preload('client')
        .preload('createdBy')
        .first()

      if (!simulation) {
        return response.notFound({
          message: 'Simulation non trouvée',
        })
      }

      if (user.role === 'client') {
        const client = await Client.findBy('email', user.email)
        if (!client || simulation.clientId !== client.id) {
          return response.forbidden({
            message: 'Vous n\'avez pas accès à cette simulation',
          })
        }
      } else if (user.role === 'agent') {
        if (simulation.client && simulation.client.assignedAgentId !== user.id) {
          return response.forbidden({
            message: 'Vous n\'avez pas accès à cette simulation',
          })
        }
      }

      let parsedParameters = null
      let parsedResults = null
      
      try {
        parsedParameters = JSON.parse(simulation.parameters)
      } catch (error) {
        console.error('Erreur parsing parameters dans show:', error)
      }
      
      try {
        if (simulation.results) {
          parsedResults = JSON.parse(simulation.results)
        }
      } catch (error) {
        console.error('Erreur parsing results dans show:', error)
      }

      return response.ok({
        simulation: {
          id: simulation.id,
          name: simulation.name,
          status: simulation.status,
          parameters: parsedParameters,
          results: parsedResults,
          client: simulation.client,
          createdBy: simulation.createdBy,
          createdAt: simulation.createdAt,
          updatedAt: simulation.updatedAt,
        },
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de la récupération de la simulation',
        error: error.message,
      })
    }
  }


  async update({ params, request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const payload = await request.validateUsing(updateSimulationValidator)

      const simulation = await Simulation.find(params.id)

      if (!simulation) {
        return response.notFound({
          message: 'Simulation non trouvée',
        })
      }

      if (user.role === 'client') {
        return response.forbidden({
          message: 'Vous n\'avez pas les permissions pour modifier une simulation',
        })
      } else if (user.role === 'agent') {
        if (simulation.clientId) {
          const client = await Client.find(simulation.clientId)
          if (!client || client.assignedAgentId !== user.id) {
            return response.forbidden({
              message: 'Vous n\'avez pas les permissions pour modifier cette simulation',
            })
          }
        }
      }

      if (payload.parameters) {
        let existingParameters = {}
        try {
          existingParameters = JSON.parse(simulation.parameters)
        } catch (error) {
          console.error('Erreur parsing existing parameters:', error)
        }
        
        const updatedParameters = { ...existingParameters, ...payload.parameters }
        simulation.parameters = JSON.stringify(updatedParameters)
        simulation.status = 'pending'
        simulation.results = null

        this.processSimulation(simulation.id)
      }

      if (payload.name) {
        simulation.name = payload.name
      }

      if (payload.clientId !== undefined) {
        if (payload.clientId) {
          const client = await Client.find(payload.clientId)
          if (!client) {
            return response.notFound({
              message: 'Client non trouvé',
            })
          }
          
          if (user.role === 'agent' && client.assignedAgentId !== user.id) {
            return response.forbidden({
              message: 'Vous ne pouvez assigner que vos propres clients',
            })
          }
        }
        
        simulation.clientId = payload.clientId
      }

      await simulation.save()

      if (simulation.clientId) {
        await simulation.load('client')
      }
      await simulation.load('createdBy')

      return response.ok({
        message: 'Simulation mise à jour avec succès',
        simulation: {
          id: simulation.id,
          name: simulation.name,
          status: simulation.status,
          client: simulation.client ? {
            id: simulation.client.id,
            firstName: simulation.client.firstName,
            lastName: simulation.client.lastName,
            fullName: simulation.client.fullName,
            email: simulation.client.email,
          } : null,
          createdBy: {
            id: simulation.createdBy.id,
            firstName: simulation.createdBy.firstName,
            lastName: simulation.createdBy.lastName,
            fullName: simulation.createdBy.fullName,
          },
          parameters: JSON.parse(simulation.parameters),
          results: simulation.results ? JSON.parse(simulation.results) : null,
          createdAt: simulation.createdAt,
          updatedAt: simulation.updatedAt,
        },
      })
    } catch (error) {
      return response.badRequest({
        message: 'Erreur lors de la mise à jour de la simulation',
        errors: error.messages || [error.message],
      })
    }
  }

  async destroy({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user!

      const simulation = await Simulation.find(params.id)

      if (!simulation) {
        return response.notFound({
          message: 'Simulation non trouvée',
        })
      }

      if (user.role === 'client') {
        return response.forbidden({
          message: 'Vous n\'avez pas les permissions pour supprimer une simulation',
        })
      } else if (user.role === 'agent') {
        const client = await Client.find(simulation.clientId)
        if (!client || client.assignedAgentId !== user.id) {
          return response.forbidden({
            message: 'Vous n\'avez pas les permissions pour supprimer cette simulation',
          })
        }
      }

      await simulation.delete()

      return response.ok({
        message: 'Simulation supprimée avec succès',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de la suppression de la simulation',
        error: error.message,
      })
    }
  }


  private async processSimulation(simulationId: number) {
    try {
      const simulation = await Simulation.find(simulationId)
      if (!simulation) return

      simulation.status = 'processing'
      await simulation.save()

      const simulationApiUrl = process.env.SIMULATION_API_URL || 'http://localhost:8000'

      // console.log(`Appel de l'API Python pour la simulation ${simulationId}`)
      
      let parsedParameters
      try {
        parsedParameters = JSON.parse(simulation.parameters)
        // console.log('Paramètres parsés:', parsedParameters)
      } catch (error) {
        console.error('Erreur lors du parsing des paramètres:', error)
        simulation.status = 'failed'
        await simulation.save()
        return
      }

      const requestData = {
        parameters: parsedParameters,
      }
      // console.log('Données envoyées à l\'API:', JSON.stringify(requestData))

      const response = await axios.post(`${simulationApiUrl}/simulate`, requestData)

      // console.log('Réponse reçue de l\'API Python:', response.data)

      if (response.data.success) {
        simulation.status = 'completed'

        const rawResults = response.data.results

        const validatedResults = {
          monthlyPayment: Number(rawResults.monthlyPayment) || 0,
          totalInterest: Number(rawResults.totalInterest) || 0,
          totalInsurance: Number(rawResults.totalInsurance) || 0,
          totalCost: Number(rawResults.totalCost) || 0,
          amortizationTable: Array.isArray(rawResults.amortizationTable)
            ? rawResults.amortizationTable.map((entry: any) => ({
                period: Number(entry.period) || 0,
                date: entry.date || '',
                payment: Number(entry.payment) || 0,
                principal: Number(entry.principal) || 0,
                interest: Number(entry.interest) || 0,
                balance: Number(entry.balance) || 0,
              }))
            : [],
          propertyValueEvolution: Array.isArray(rawResults.propertyValueEvolution)
            ? rawResults.propertyValueEvolution.map((entry: any) => ({
                year: Number(entry.year) || 0,
                value: Number(entry.value) || 0,
                remainingCapital: Number(entry.remainingCapital) || 0,
                netEquity: Number(entry.netEquity) || 0,
              }))
            : [],
          salaryRequirement: Number(rawResults.salaryRequirement) || 0,
        }

        // console.log('Résultats validés:', validatedResults)
        simulation.results = JSON.stringify(validatedResults)
      } else {
        simulation.status = 'failed'
        console.error('L\'API Python a retourné une erreur:', response.data.error)
      }

      await simulation.save()
      // console.log(`Simulation ${simulationId} sauvegardée avec succès`)
    } catch (error) {
      const simulation = await Simulation.find(simulationId)
      if (simulation) {
        simulation.status = 'failed'
        await simulation.save()
      }
      console.error('Erreur lors du traitement de la simulation:', error)
      console.error('Détails de l\'erreur:', error.response?.data || error.message)
    }
  }
}