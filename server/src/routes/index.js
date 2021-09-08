import config from '../libs/config/index.js'
import authRoutes from '../auth/auth.routes.js'
import userRoutes from '../user/user.routes.js'
import categoryRoutes from '../category/category.routes.js'
import productRoutes from '../product/product.routes.js'
import paymentRoutes from '../payment/payment.routes.js'
import orderRoutes from '../order/order.routes.js'

const API_PREFIX = config.get('app:api_prefix')

export function bindRoutes(app) {
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'ok' })
  })
  app.use(API_PREFIX, authRoutes)
  app.use(API_PREFIX, userRoutes)
  app.use(API_PREFIX, categoryRoutes)
  app.use(API_PREFIX, productRoutes)
  app.use(API_PREFIX, paymentRoutes)
  app.use(API_PREFIX, orderRoutes)
}
