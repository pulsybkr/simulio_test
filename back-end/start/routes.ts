/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// Import des contrôleurs
const AuthController = () => import('#controllers/auth_controller')
const ClientsController = () => import('#controllers/clients_controller')
const SimulationsController = () => import('#controllers/simulations_controller')

/*
|--------------------------------------------------------------------------
| Routes publiques (sans authentification)
|--------------------------------------------------------------------------
*/

// Route de santé
router.get('/health', async () => {
  return { status: 'OK', timestamp: new Date().toISOString() }
})

// Routes d'authentification
router.group(() => {
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])
}).prefix('/auth')

/*
|--------------------------------------------------------------------------
| Routes protégées (avec authentification)
|--------------------------------------------------------------------------
*/

router.group(() => {
  // Routes d'authentification protégées
  router.post('/logout', [AuthController, 'logout'])
  router.get('/me', [AuthController, 'me'])
  router.post('/refresh', [AuthController, 'refresh'])
}).prefix('/auth').use(middleware.auth())

// Routes des clients (protégées)
router.group(() => {
  router.get('/', [ClientsController, 'index'])
  router.post('/', [ClientsController, 'store'])
  router.get('/:id', [ClientsController, 'show'])
  router.put('/:id', [ClientsController, 'update'])
  router.delete('/:id', [ClientsController, 'destroy'])
})
.prefix('/clients')
.use(middleware.auth({ roles: ['admin', 'agent'] }))

// Routes des simulations (protégées)
router.group(() => {
  router.get('/', [SimulationsController, 'index'])
  router.post('/', [SimulationsController, 'store'])
  router.get('/:id', [SimulationsController, 'show'])
  router.put('/:id', [SimulationsController, 'update'])
  router.delete('/:id', [SimulationsController, 'destroy'])
})
.prefix('/simulations')
.use(middleware.auth())

/*
|--------------------------------------------------------------------------
| Routes d'administration (Admin seulement)
|--------------------------------------------------------------------------
*/

router.group(() => {
  // Gestion des utilisateurs
  router.get('/users', async ({ response }) => {
    // TODO: Implémenter la liste des utilisateurs
    return response.ok({ message: 'Liste des utilisateurs - TODO' })
  })

  // Statistiques globales
  router.get('/stats', async ({ response }) => {
    // TODO: Implémenter les statistiques
    return response.ok({
      message: 'Statistiques globales - TODO',
      stats: {
        totalUsers: 0,
        totalClients: 0,
        totalSimulations: 0,
        activeSimulations: 0,
      },
    })
  })
})
.prefix('/admin')
.use(middleware.auth({ roles: ['admin'] }))
