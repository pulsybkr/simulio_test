import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import logger from '@adonisjs/core/services/logger'

export default class HttpLoggerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Enregistrer le début de la requête
    const startTime = process.hrtime.bigint()
    const { request, response } = ctx

    // Informations de base de la requête
    const method = request.method()
    const url = request.url(true)
    const userAgent = request.header('User-Agent') || 'Unknown'
    const ip = request.ip()
    const contentLength = request.header('Content-Length') || '0'

    // Informations d'authentification (si disponible)
    const user = ctx.auth?.user
    const userInfo = user ? `User:${user.id}(${user.email})` : 'Anonymous'

    // Log de la requête entrante
    logger.info('→ HTTP Request', {
      method,
      url: url,
      userAgent: userAgent.substring(0, 100), // Limiter la longueur
      ip,
      contentLength,
      user: userInfo,
      timestamp: new Date().toISOString(),
    })

    try {
      /**
       * Traiter la requête
       */
      const output = await next()

      // Calculer le temps de réponse
      const endTime = process.hrtime.bigint()
      const responseTime = Number(endTime - startTime) / 1000000 // Convertir en millisecondes

      // Informations de la réponse
      const statusCode = response.getStatus()
      const responseSize = response.getHeader('Content-Length') || '0'

      // Déterminer le niveau de log selon le status
      const logLevel = this.getLogLevel(statusCode)

      // Log de la réponse
      logger[logLevel]('← HTTP Response', {
        method,
        url: url,
        status: statusCode,
        responseTime: `${responseTime.toFixed(2)}ms`,
        responseSize: `${responseSize} bytes`,
        user: userInfo,
        timestamp: new Date().toISOString(),
      })

      return output

    } catch (error) {
      // Calculer le temps de réponse même en cas d'erreur
      const endTime = process.hrtime.bigint()
      const responseTime = Number(endTime - startTime) / 1000000

      // Log de l'erreur
      logger.error('✗ HTTP Error', {
        method,
        url: url,
        status: 500,
        responseTime: `${responseTime.toFixed(2)}ms`,
        error: error.message,
        stack: error.stack,
        user: userInfo,
        timestamp: new Date().toISOString(),
      })

      // Relancer l'erreur pour qu'elle soit gérée par les autres middlewares
      throw error
    }
  }

  /**
   * Détermine le niveau de log selon le code de statut HTTP
   */
  private getLogLevel(statusCode: number): 'info' | 'warn' | 'error' {
    if (statusCode >= 200 && statusCode < 400) {
      return 'info'
    } else if (statusCode >= 400 && statusCode < 500) {
      return 'warn'
    } else {
      return 'error'
    }
  }
}