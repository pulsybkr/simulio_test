import type { HttpContext } from '@adonisjs/core/http'
import Simulation from '#models/simulation'
import Client from '#models/client'
import { createSimulationValidator, updateSimulationValidator } from '#validators/simulation'
import axios from 'axios'

export default class SimulationsController {
  /**
   * Liste des simulations selon le rôle de l'utilisateur
   */
  async index({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const { clientId } = request.qs()

      let query = Simulation.query()
        .preload('client')
        .preload('createdBy')

      // Filtrer selon le rôle
      if (user.role === 'client') {
        // Les clients voient seulement leurs propres simulations
        // On trouve d'abord le client associé à l'utilisateur
        const client = await Client.findBy('email', user.email)
        if (client) {
          query = query.where('clientId', client.id)
        } else {
          return response.ok({ simulations: [] })
        }
      } else if (user.role === 'agent') {
        // Les agents voient les simulations de leurs clients + simulations sans client
        const clientIds = await Client.query()
          .where('assignedAgentId', user.id)
          .select('id')
        
        if (clientIds.length > 0) {
          query = query.where((subQuery) => {
            subQuery.whereIn('clientId', clientIds.map(c => c.id))
                    .orWhereNull('clientId')
          })
        } else {
          // Si l'agent n'a pas de clients, il voit seulement les simulations sans client
          query = query.whereNull('clientId')
        }
      }
      // Les admins voient toutes les simulations

      // Filtrer par client si spécifié
      if (clientId) {
        query = query.where('clientId', clientId)
      }

      const simulations = await query
        .orderBy('createdAt', 'desc')
        .limit(50) // Limiter pour la performance

      return response.ok({
        simulations: simulations.map(simulation => {
          // Parser les résultats JSON pour l'aperçu
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

  /**
   * Création d'une nouvelle simulation
   */
  async store({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      
      // Vérifier que les clients ne peuvent pas créer de simulations
      if (user.role === 'client') {
        return response.forbidden({
          message: 'Les clients ne peuvent pas créer de nouvelles simulations',
        })
      }
      
      console.log('Données reçues du frontend:', request.body())
      const payload = await request.validateUsing(createSimulationValidator)
      console.log('Données validées:', payload)

      // Vérifier que le client existe et que l'utilisateur a les droits (si un client est spécifié)
      let client = null
      if (payload.clientId) {
        client = await Client.find(payload.clientId)

        if (!client) {
          return response.notFound({
            message: 'Client non trouvé',
          })
        }

        // Vérifier les permissions
        if (user.role === 'agent' && client.assignedAgentId !== user.id) {
          return response.forbidden({
            message: 'Vous n\'avez pas les permissions pour créer une simulation pour ce client',
          })
        }
      }

      // Créer la simulation avec sérialisation manuelle des paramètres
      const simulation = new Simulation()
      simulation.name = payload.name
      simulation.clientId = payload.clientId || null
      simulation.createdById = user.id
      simulation.parameters = JSON.stringify(payload.parameters)
      simulation.status = 'pending'
      await simulation.save()

      // Lancer le calcul en arrière-plan
      this.processSimulation(simulation.id)

      // Charger les relations seulement si elles existent
      if (simulation.clientId) {
        await simulation.load('client')
      }
      await simulation.load('createdBy')

      // Parser les paramètres pour le frontend
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
          results: null, // Nouveau, donc pas encore de résultats
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

  /**
   * Affichage d'une simulation spécifique
   */
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

      // Vérifier les permissions
      if (user.role === 'client') {
        // Vérifier que la simulation appartient au client connecté
        const client = await Client.findBy('email', user.email)
        if (!client || simulation.clientId !== client.id) {
          return response.forbidden({
            message: 'Vous n\'avez pas accès à cette simulation',
          })
        }
      } else if (user.role === 'agent') {
        // Vérifier que la simulation appartient à un client de l'agent ou n'a pas de client
        if (simulation.client && simulation.client.assignedAgentId !== user.id) {
          return response.forbidden({
            message: 'Vous n\'avez pas accès à cette simulation',
          })
        }
      }

      // Parser les données JSON pour le frontend
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

  /**
   * Mise à jour d'une simulation
   */
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

      // Vérifier les permissions
      if (user.role === 'client') {
        return response.forbidden({
          message: 'Vous n\'avez pas les permissions pour modifier une simulation',
        })
      } else if (user.role === 'agent') {
        // Si la simulation a un client, vérifier qu'il appartient à l'agent
        if (simulation.clientId) {
          const client = await Client.find(simulation.clientId)
          if (!client || client.assignedAgentId !== user.id) {
            return response.forbidden({
              message: 'Vous n\'avez pas les permissions pour modifier cette simulation',
            })
          }
        }
        // Si pas de client, l'agent peut modifier (simulation créée par lui)
      }

      // Si les paramètres changent, relancer le calcul
      if (payload.parameters) {
        // Parser les paramètres existants et les fusionner avec les nouveaux
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

        // Relancer le calcul
        this.processSimulation(simulation.id)
      }

      if (payload.name) {
        simulation.name = payload.name
      }

      await simulation.save()

      return response.ok({
        message: 'Simulation mise à jour avec succès',
        simulation: {
          id: simulation.id,
          name: simulation.name,
          status: simulation.status,
          parameters: simulation.parameters,
        },
      })
    } catch (error) {
      return response.badRequest({
        message: 'Erreur lors de la mise à jour de la simulation',
        errors: error.messages || [error.message],
      })
    }
  }

  /**
   * Suppression d'une simulation
   */
  async destroy({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user!

      const simulation = await Simulation.find(params.id)

      if (!simulation) {
        return response.notFound({
          message: 'Simulation non trouvée',
        })
      }

      // Vérifier les permissions
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

  /**
   * Traite une simulation en appelant l'API Python
   */
  private async processSimulation(simulationId: number) {
    try {
      const simulation = await Simulation.find(simulationId)
      if (!simulation) return

      simulation.status = 'processing'
      await simulation.save()

      // Appeler l'API Python (à adapter selon votre configuration)
      const simulationApiUrl = process.env.SIMULATION_API_URL || 'http://localhost:8000'

      console.log(`Appel de l'API Python pour la simulation ${simulationId}`)
      
      // Parser les paramètres depuis la chaîne JSON
      let parsedParameters
      try {
        parsedParameters = JSON.parse(simulation.parameters)
        console.log('Paramètres parsés:', parsedParameters)
      } catch (error) {
        console.error('Erreur lors du parsing des paramètres:', error)
        simulation.status = 'failed'
        await simulation.save()
        return
      }

      const requestData = {
        parameters: parsedParameters,
      }
      console.log('Données envoyées à l\'API:', JSON.stringify(requestData))

      const response = await axios.post(`${simulationApiUrl}/simulate`, requestData)

      // console.log('Réponse reçue de l\'API Python:', response.data)

      if (response.data.success) {
        simulation.status = 'completed'

        // Valider et transformer les données reçues de l'API Python
        const rawResults = response.data.results

        // S'assurer que les données sont correctement structurées
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

        console.log('Résultats validés:', validatedResults)
        // Forcer la sérialisation JSON manuelle
        simulation.results = JSON.stringify(validatedResults)
      } else {
        simulation.status = 'failed'
        console.error('L\'API Python a retourné une erreur:', response.data.error)
      }

      await simulation.save()
      console.log(`Simulation ${simulationId} sauvegardée avec succès`)
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