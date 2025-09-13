import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
      roles?: ('admin' | 'agent' | 'client')[]
    } = {}
  ) {
    try {
      await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })

      const user = ctx.auth.user!

      // Vérifier si l'utilisateur est actif
      if (!user.isActive) {
        return ctx.response.forbidden({
          message: 'Votre compte est désactivé',
        })
      }

      // Vérifier les rôles si spécifiés
      if (options.roles && options.roles.length > 0) {
        if (!options.roles.includes(user.role)) {
          return ctx.response.forbidden({
            message: 'Accès refusé - Permissions insuffisantes',
          })
        }
      }

      return next()
    } catch (error) {
      return ctx.response.unauthorized({
        message: 'Authentification requise',
      })
    }
  }
}