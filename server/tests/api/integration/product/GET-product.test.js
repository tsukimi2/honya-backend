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
  let product1sold6 = null
  let product2 = null
  let product2sold6 = null
  let product3 = null
  let category = null
  let category2 = null
  let category3 = null
  let res = null

  before(async () => {
    res = null

    try {
      await Product.deleteMany({ "name": /^product*/ })
      await Category.deleteMany({ "name": /^category*/ })

      category = await generateCategory({})
      category2 = await generateCategory({
        optParams: {
          name: 'category2'
        }
      })
      category3 = await generateCategory({
        optParams: {
          name: 'category3'
        }
      })
      product = await generateProduct({ optParams: { category: category._id } })
      product1sold6 = await generateProduct({
        optParams: {
          name: 'product1',
          category: category._id,
          sold: 6,
        }
      })
      product2 = await generateProduct({
        optParams: {
          name: 'product2',
          category: category._id,
        }
      })
      product2sold6 = await generateProduct({
        optParams: {
          name: 'product2',
          category: category2._id,
          sold: 6,
        }
      })
      product3 = await generateProduct({
        optParams: {
          name: 'product2',
          category: category3._id,
        }
      })
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
      expect(res.body.data.product).to.have.property('category')
      expect(res.body.data.product.category).to.have.property('_id').to.eq(product.category.toString())
      expect(res.body.data.product.category).to.have.property('name')
      expect(res.body.data.product).to.not.have.property('quantity')
      expect(res.body.data.product).to.have.property('sold').to.eq(product.sold)
      expect(res.body.data.product).to.not.have.property('shipping')
      expect(res.body.data.product).to.not.have.property('photo')
    })

    it('should throw NotFoundError when product not found', async () => {
      const randomProductId = mongoose.Types.ObjectId().toString()

      try {
        res = await request(app)
          .get(`${API_PREFIX}/products/${randomProductId}`)
          .expect(404)
      } catch(e) {
        console.log(e)
      }

      expect(res.body).to.have.property('err').to.eq('NotFoundError')
      expect(res.body).to.have.property('errmsg').to.eq('product not found')
    })
  })

  describe(API_PREFIX + '/products', () => {
    it('should return all products with valid query params', async () => {
      try {
        res = await request(app)
          .get(`${API_PREFIX}/products`)
          .expect(200)
      } catch(e) {
        console.log(e)
      }

      expect(res.body.data).to.exist
      expect(res.body.data.products).to.be.an('array')
      expect(res.body.data.products.length).to.eq(5)
    })

    // http://localhost/api/v1/products?sortBy=name,sold&order=1,1&limit=3
    it('should return products with valid query params and with sort, order, and limit params', async () => {
      const sortBy = 'sold,name'
      const order = '-1,1'
      const limit = 3

      try {
        res = await request(app)
          .get(`${API_PREFIX}/products?sortBy=${sortBy}&order=${order},1&limit=${limit}`)
          .expect(200)
      } catch(e) {
        console.log(e)
      }

      expect(res.body.data).to.exist
      expect(res.body.data.products).to.be.an('array')
      expect(res.body.data.products.length).to.eq(limit)
      expect(res.body.data.products[0]).to.have.property('sold').to.eq(product1sold6.sold)
      expect(res.body.data.products[0]).to.have.property('name').to.eq(product1sold6.name)
      expect(res.body.data.products[1]).to.have.property('sold').to.eq(product2sold6.sold)
      expect(res.body.data.products[1]).to.have.property('name').to.eq(product2sold6.name)
      expect(res.body.data.products[2]).to.have.property('sold').to.eq(product.sold)
      expect(res.body.data.products[2]).to.have.property('name').to.eq(product.name)      
    })

    it('should return products with valid query params but sortBy and order includes white spaces', async () => {
      const sortBy = 'sold, name'
      const order = '-1, 1'
      const limit = 3

      try {
        res = await request(app)
          .get(`${API_PREFIX}/products?sortBy=${sortBy}&order=${order},1&limit=${limit}`)
          .expect(200)
      } catch(e) {
        console.log(e)
      }

      expect(res.body.data).to.exist
      expect(res.body.data.products).to.be.an('array')
      expect(res.body.data.products.length).to.eq(limit)
      expect(res.body.data.products[0]).to.have.property('sold').to.eq(product1sold6.sold)
      expect(res.body.data.products[0]).to.have.property('name').to.eq(product1sold6.name)
      expect(res.body.data.products[1]).to.have.property('sold').to.eq(product2sold6.sold)
      expect(res.body.data.products[1]).to.have.property('name').to.eq(product2sold6.name)
      expect(res.body.data.products[2]).to.have.property('sold').to.eq(product.sold)
      expect(res.body.data.products[2]).to.have.property('name').to.eq(product.name)      
    })

    it('should return all products with valid query params with missing sorBy field', async () => {
      const order = '-1, 1'
      const limit = 3

      try {
        res = await request(app)
        .get(`${API_PREFIX}/products?sortBy=&order=${order},1&limit=${limit}`)
          .expect(200)
      } catch(e) {
        console.log(e)
      }

      expect(res.body.data).to.exist
      expect(res.body.data.products).to.be.an('array')
      expect(res.body.data.products.length).to.eq(limit)
    })

    it('should throw BadRequestError with invalid query params', async () => {
      const sortBy = 'dummyfield'
      const order = '-1,2'
      const limit = 3

      try {
        res = await request(app)
        .get(`${API_PREFIX}/products?sortBy${sortBy}=&order=${order},1&limit=${limit}`)
          .expect(400)
      } catch(e) {
        console.log(e)
      }


    })

    it('should throw NotFoundError when product not found', async () => {
      const sortBy = 'sold, name'
      const order = '-1, 1'
      const limit = 3

      try {
        await Product.deleteMany({ "name": /^product*/ })
        res = await request(app)
          .get(`${API_PREFIX}/products?sortBy=${sortBy}&order=${order},1&limit=${limit}`)
          .expect(404)
      } catch(e) {
        console.log(e)
      }

      expect(res.body).to.have.property('err').to.eq('NotFoundError')
      expect(res.body).to.have.property('errmsg').to.eq('product not found')

      try {
        product = await generateProduct({ optParams: { category: category._id } })
        product1sold6 = await generateProduct({
          optParams: {
            name: 'product1',
            category: category._id,
            sold: 6,
          }
        })
        product2 = await generateProduct({
          optParams: {
            name: 'product2',
            category: category._id,
          }
        })
        product2sold6 = await generateProduct({
          optParams: {
            name: 'product2',
            category: category2._id,
            sold: 6,
          }
        })
        product3 = await generateProduct({
          optParams: {
            name: 'product2',
            category: category3._id,
          }
        })
      } catch(e) {
        console.log(e)
      }
    })
  })

  describe(API_PREFIX + '/products/related/:productId', () => {
    it('should return related products with valid product id and query limit param', async () => {
      const limit = 3

      try {
        res = await request(app)
          .get(`${API_PREFIX}/products/related/${product._id}?limit=${limit}`)
          .expect(200)
      } catch(e) {
        console.log(e)
      }

      expect(res.body.data).to.exist
      expect(res.body.data.products).to.be.an('array').to.have.length(2)
      expect(res.body.data.products[0]).to.have.property('_id').to.eq(product1sold6._id.toString())
      expect(res.body.data.products[0]).to.have.property('name').to.eq(product1sold6.name)
      expect(res.body.data.products[0]).to.have.property('category')
      expect(res.body.data.products[1]).to.have.property('_id').to.eq(product2._id.toString())
      expect(res.body.data.products[1]).to.have.property('name').to.eq(product2.name)
      expect(res.body.data.products[1]).to.have.property('category')
    })

    it('should throw NotFoundError if no related product is found', async () => {
      try {
        res = await request(app)
          .get(`${API_PREFIX}/products/related/${product3._id}`)
          .expect(404)
      } catch(e) {
        console.log(e)
      }

      expect(res.body).to.have.property('err').to.eq('NotFoundError')
      expect(res.body).to.have.property('errmsg').to.eq('product not found')
    })
  })

  describe(API_PREFIX + '/products/categories', () => {
    it('should list all distinct categories in products collection if products exist in db', async () => {
      try {
        res = await request(app)
          .get(`${API_PREFIX}/products/categories`)
          .expect(200)
      } catch(e) {
        console.log(e)
      }

      expect(res.body.data).to.exist
      expect(res.body.data.categories).to.be.an('array').to.have.length(3)
    })

    it('should throw NotFoundError if no product in db', async () => {
      try {
        await Product.deleteMany({ "name": /^product*/ })
      } catch(e) {
        console.log(e)
      }

      try {
        res = await request(app)
          .get(`${API_PREFIX}/products/categories`)
          .expect(404)
      } catch(e) {
        console.log(e)
      }

      expect(res.body).to.have.property('err').to.eq('NotFoundError')
      expect(res.body).to.have.property('errmsg').to.eq('product categories not found')
    })
  })
})
