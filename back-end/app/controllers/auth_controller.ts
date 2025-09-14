import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/register'
import logger from '@adonisjs/core/services/logger'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)

      logger.info('Nouvelle inscription utilisateur', {
        email: payload.email,
        role: payload.role || 'client',
        ip: request.ip(),
      })

      const user = await User.create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
        role: payload.role || 'client',
        isActive: true,
      })

      const token = await User.accessTokens.create(user, ['*'], {
        expiresIn: '7 days',
      })

      logger.info('Utilisateur créé avec succès', {
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      return response.created({
        message: 'Utilisateur créé avec succès',
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
        },
        token: {
          value: token.value!.release(),
          type: token.type,
          expiresAt: token.expiresAt,
        },
      })
    } catch (error) {
      logger.warn('Erreur lors de l\'inscription', {
        email: request.input('email'),
        error: error.message,
        ip: request.ip(),
      })

      return response.badRequest({
        message: 'Erreur lors de l\'inscription',
        errors: error.messages || [error.message],
      })
    }
  }

  async login({ request, response, auth }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)

      logger.info('Tentative de connexion', {
        email,
        ip: request.ip(),
        userAgent: request.header('User-Agent')?.substring(0, 100),
      })

      const user = await User.verifyCredentials(email, password)

      if (!user.isActive) {
        logger.warn('Tentative de connexion avec compte désactivé', {
          userId: user.id,
          email: user.email,
          ip: request.ip(),
        })

        return response.forbidden({
          message: 'Votre compte est désactivé',
        })
      }

      const token = await User.accessTokens.create(user, ['*'], {
        expiresIn: '7 days',
      })

      logger.info('Connexion réussie', {
        userId: user.id,
        email: user.email,
        role: user.role,
        ip: request.ip(),
      })

      return response.ok({
        message: 'Connexion réussie',
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
        },
        token: {
          value: token.value!.release(),
          type: token.type,
          expiresAt: token.expiresAt,
        },
      })
    } catch (error) {
      logger.warn('Échec de connexion', {
        email: request.input('email'),
        ip: request.ip(),
        error: error.message,
      })

      return response.unauthorized({
        message: 'Email ou mot de passe incorrect',
      })
    }
  }

  async logout({ response, auth }: HttpContext) {
    try {
      const user = auth.user!
      await User.accessTokens.delete(user, auth.user!.currentAccessToken.identifier)

      return response.ok({
        message: 'Déconnexion réussie',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de la déconnexion',
      })
    }
  }

  async me({ response, auth }: HttpContext) {
    try {
      const user = auth.user!

      return response.ok({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de la récupération des informations utilisateur',
      })
    }
  }

  async refresh({ response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const token = await User.accessTokens.create(user, ['*'], {
        expiresIn: '7 days',
      })

      return response.ok({
        token: {
          value: token.value!.release(),
          type: token.type,
          expiresAt: token.expiresAt,
        },
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors du rafraîchissement du token',
      })
    }
  }
}