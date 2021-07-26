import config from '../libs/config/index.js'
import authRoutes from '../auth/auth.routes.js'
import userRoutes from '../user/user.routes.js'

const API_PREFIX = config.get('app:api_prefix')

export function bindRoutes(app) {
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'ok' })
  })
  app.use(API_PREFIX, authRoutes)
  app.use(API_PREFIX, userRoutes)
}
