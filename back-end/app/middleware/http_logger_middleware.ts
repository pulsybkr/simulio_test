import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import logger from '@adonisjs/core/services/logger'

export default class HttpLoggerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const startTime = process.hrtime.bigint()
    const { request, response } = ctx

    const method = request.method()
    const url = request.url(true)
    const userAgent = request.header('User-Agent') || 'Unknown'
    const ip = request.ip()
    const contentLength = request.header('Content-Length') || '0'

    const user = ctx.auth?.user
    const userInfo = user ? `User:${user.id}(${user.email})` : 'Anonymous'

    logger.info('→ HTTP Request', {
      method,
      url: url,
      userAgent: userAgent.substring(0, 100),
      ip,
      contentLength,
      user: userInfo,
      timestamp: new Date().toISOString(),
    })

    try {
      const output = await next()

      const endTime = process.hrtime.bigint()
      const responseTime = Number(endTime - startTime) / 1000000

      const statusCode = response.getStatus()
      const responseSize = response.getHeader('Content-Length') || '0'

      const logLevel = this.getLogLevel(statusCode)

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
      const endTime = process.hrtime.bigint()
      const responseTime = Number(endTime - startTime) / 1000000

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

      throw error
    }
  }

  
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