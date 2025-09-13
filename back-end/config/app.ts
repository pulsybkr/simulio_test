import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  appKey: 'your-super-secret-app-key-change-this-in-production',
  http: {
    trustProxy: () => true,
    cookie: {},
    cors: {
      enabled: true,
      origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: true,
      credentials: true,
    },
  },
})