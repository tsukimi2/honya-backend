import authRoutes from '../auth/auth.routes.js'
import userRoutes from '../user/user.routes.js'

const API_PREFIX = '/api/v1'

export function bindRoutes(app) {
  app.use(API_PREFIX, authRoutes)
  app.use(API_PREFIX, userRoutes)
}
