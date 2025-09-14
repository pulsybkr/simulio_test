
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const ClientsController = () => import('#controllers/clients_controller')
const SimulationsController = () => import('#controllers/simulations_controller')

router.get('/health', async () => {
  return { status: 'OK', timestamp: new Date().toISOString() }
})

router.group(() => {
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])
}).prefix('/auth')

router.group(() => {
  router.post('/logout', [AuthController, 'logout'])
  router.get('/me', [AuthController, 'me'])
  router.post('/refresh', [AuthController, 'refresh'])
}).prefix('/auth').use(middleware.auth())

router.group(() => {
  router.get('/', [ClientsController, 'index'])
  router.post('/', [ClientsController, 'store'])
  router.get('/:id', [ClientsController, 'show'])
  router.put('/:id', [ClientsController, 'update'])
  router.delete('/:id', [ClientsController, 'destroy'])
})
.prefix('/clients')
.use(middleware.auth({ roles: ['admin', 'agent'] }))

router.group(() => {
  router.get('/', [SimulationsController, 'index'])
  router.post('/', [SimulationsController, 'store'])
  router.get('/:id', [SimulationsController, 'show'])
  router.put('/:id', [SimulationsController, 'update'])
  router.delete('/:id', [SimulationsController, 'destroy'])
})
.prefix('/simulations')
.use(middleware.auth())

router.group(() => {
  router.get('/users', async ({ response }) => {
    return response.ok({ message: 'Liste des utilisateurs - TODO' })
  })

  router.get('/stats', async ({ response }) => {
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
