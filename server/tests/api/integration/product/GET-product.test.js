import { expect } from 'chai'
import request from 'supertest'
import mongoose from 'mongoose'
import app from '../../../../src/app.js'
import config from '../../../../src/libs/config/index.js'
import Product from '../../../../src/product/product.model.js'
import Category from '../../../../src/category/category.model.js'
import { generateProduct } from '../../../factories/productFactory.js'
import { generateCategory } from '../../../factories/categoryFactory.js'

const API_PREFIX = config.get('app:api_prefix')

describe('Get products', () => {  
  let product = null

  before(async () => {
    try {
      await Product.deleteMany({ "name": /^product*/ })
      await Category.deleteMany({ "name": /^category*/ })

      const category = await generateCategory({})
      product = await generateProduct({ optParams: { category: category._id } })
    } catch(e) { 
      console.log(e)
    }
  })

  after(async () => {
    await Product.deleteMany({ "name": /^product*/ })
    await Category.deleteMany({ "name": /^category*/ })
  })

  describe(API_PREFIX + '/products/:productId', () => {
    it('should return product with valid productId', async () => {
      const res = await request(app)
        .get(`${API_PREFIX}/products/${product._id}`)
        .expect(200)

      expect(res.body.data).to.exist
      expect(res.body.data.product).to.exist
      expect(res.body.data.product).to.have.property('_id').to.eq(product._id.toString())
      expect(res.body.data.product).to.have.property('name').to.eq(product.name)
      expect(res.body.data.product).to.have.property('description').to.eq(product.description)
      expect(res.body.data.product).to.have.property('price').to.eq(product.price)
      expect(res.body.data.product).to.have.property('category').to.eq(product.category.toString())
      expect(res.body.data.product).to.not.have.property('quantity')
      expect(res.body.data.product).to.have.property('sold').to.eq(product.sold)
      expect(res.body.data.product).to.not.have.property('shipping')
      expect(res.body.data.product).to.not.have.property('photo')
    })
  
    it('should throw NotFoundError with missing productId', async () => {
      const res = await request(app)
        .get(`${API_PREFIX}/products/`)
        .expect(404)
    })

    it('should throw NotFoundError when product not found', async () => {
      const randomProductId = mongoose.Types.ObjectId().toString()

      const res = await request(app)
      .get(`${API_PREFIX}/products/${randomProductId}`)
      .expect(404)

      expect(res.body).to.have.property('err').to.eq('NotFoundError')
      expect(res.body).to.have.property('errmsg').to.eq('product not found')
    })
  })
})
