import mongoose from 'mongoose'
import { expect } from 'chai'
import request from 'supertest'
import app from '../../../../src/app.js'
import config from '../../../../src/libs/config/index.js'
import User from '../../../../src/user/user.model.js'
import Product from '../../../../src/product/product.model.js'
import Category from '../../../../src/category/category.model.js'
import { generateUserParams } from '../../../factories/userFactory.js'
import { generateProductParams, generateProduct } from '../../../factories/productFactory.js'
import { generateCategory } from '../../../factories/categoryFactory.js'

const API_PREFIX = config.get('app:api_prefix')

describe(`PUT $(API_PREFIX}/product`, () => {
  let category1 = null
  let category1_id = null
  let storedProduct = null
  let productParams = null

  before(async () => {
    try {
      await Category.deleteMany({ "name": /^category*/ })
      category1 = await Category.create({ "name": 'category1' })
      category1_id = category1._id.toString()
    } catch(e) {
      console.log(e)
    }
  })

  after(async () => {
    try {
      await Category.deleteMany({ "name": /^category*/ })
    } catch(e) {
      console.log(e)
    }
    
    category1 = null
    category1_id = null
  })

  context('Admin logged in', () => {
    const admin = generateUserParams({ userProfile: 'validAdmin1' })
    let accessToken = ''
    let refreshToken = ''
    const loginHash = 'admindummyhash'

    before(async () => {
      try {
        await User.deleteMany({ "username": /^admin*/ })
  
        // register a test admin
        const res0 = await request(app)
          .post(API_PREFIX + '/register')
          .send(`username=${admin.username}`)
          .send(`password=${admin.password}`)
          .send(`email=${admin.email}`)
          .send(`role=${admin.role}`)
          .set('Accept', 'application/json')

        const res = await request(app)
          .post(API_PREFIX + '/login')
          .send(`username=${admin.username}`)
          .send(`password=${admin.password}`)
          .set('Accept', 'application/json')

        accessToken = res.body.access_token
        refreshToken = res.body.refresh_token
      } catch(err) {
        console.log(err)
      }
    })

    after(async () => {
      await User.deleteMany({ "username": /^admin*/ })
      await request(app)
        .get(API_PREFIX + '/logout')
        .set('Accept', 'application/json')
    })

    beforeEach(async () => {
      productParams = generateProductParams({})

      try {
        storedProduct = await generateProduct({ 
          optParams: {
            category: category1_id
          }
        })
      } catch(e) {
        console.log(e)
      }
    })

    afterEach(async () => {
      try {
        await Product.deleteMany({ "name": /^product*/ })
      } catch(e) {
        console.log(e)
      }
    })

    it('should update product successfully with valid product params', async () => {
      let category2 = null
      try {
        category2 = await generateCategory({
          optParams: {
            name: 'category2'
          }
        })
      } catch(e) {
        console.log(e)
      }

      productParams['name'] = 'product2'
      productParams['category'] = category2._id.toString()
      productParams['quantity'] = 3

      const res = await request(app)
        .put(`${API_PREFIX}/products/${storedProduct._id}`)
        .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
        .field('name', productParams.name)
        .field('category', productParams.category)
        .field('quantity', productParams.quantity)
        //.attach('image1', 'path/to/felix.jpeg')
        //.attach('image2', imageBuffer, 'luna.jpeg')
        .expect(200)

      expect(res.body.data).to.exist
      expect(res.body.data).to.have.property('name').to.eq(productParams.name)
      expect(res.body.data).to.have.property('description').to.eq(storedProduct.description)
      expect(res.body.data).to.have.property('price').to.eq(storedProduct.price)
      expect(res.body.data).to.have.property('category').to.eq(productParams.category)
      expect(res.body.data).to.have.property('quantity').to.eq(productParams.quantity)
      expect(res.body.data).to.have.property('sold').to.eq(0)
      expect(res.body.data).to.not.have.property('shipping')
      expect(res.body.data).to.not.have.property('photo')

      try {
        await Category.deleteOne({ _id: category2._id })
      } catch(e) {
        console.log(e)
      }
    })

    it('should receive UnprocessableEntityError with valid product params with cateogory id not found in db', async () => {
      productParams['name'] = 'product2'
      productParams['category'] = mongoose.Types.ObjectId().toString()
      productParams['quantity'] = 3

      const res = await request(app)
        .put(`${API_PREFIX}/products/${storedProduct._id}`)
        .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
        .field('name', productParams.name)
        .field('category', productParams.category)
        .field('quantity', productParams.quantity)
        //.attach('image1', 'path/to/felix.jpeg')
        //.attach('image2', imageBuffer, 'luna.jpeg')
        .expect(422)

        expect(res.body).to.have.property('err').to.eq('UnprocessableEntityError')    
    })
  })

  context('User logged in', () => {
    const user = generateUserParams({ userProfile: 'validUser1' })
    let accessToken = ''
    let refreshToken = ''
    const loginHash = 'userdummyhash'

    before(async () => {
      try {
        await User.deleteMany({ "username": /^user*/ })
  
        // register a test user
        await request(app)
          .post(API_PREFIX + '/register')
          .send(`username=${user.username}`)
          .send(`password=${user.password}`)
          .send(`email=${user.email}`)
          .set('Accept', 'application/json')
  
        const res = await request(app)
          .post(API_PREFIX + '/login')
          .send(`username=${user.username}`)
          .send(`password=${user.password}`)
          .set('Accept', 'application/json')  

        accessToken = res.body.access_token
        refreshToken = res.body.refresh_token  
      } catch(err) {
        console.log(err)
      }
    })

    after(async () => {
      await User.deleteMany({ "username": /^user*/ })

      await request(app)
        .get(API_PREFIX + '/logout')
        .set('Accept', 'application/json')
    })

    it('should receive ForbiddenError if user is logged in with insufficient privilege level', async () => {
      const productParams = generateProductParams({})
      const dummyProductId = mongoose.Types.ObjectId().toString()

      const res = await request(app)
        .put(`${API_PREFIX}/products/${dummyProductId}`)
        .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
        .field('name', productParams.name)
        .field('category', productParams.description)
        //.attach('image1', 'path/to/felix.jpeg')
        //.attach('image2', imageBuffer, 'luna.jpeg')
        .expect(403)

      expect(res.body).to.have.property('err').to.eq('ForbiddenError')
      expect(res.body).to.have.property('errmsg').to.eq('User is not admin')
    })
  })

  context('Not logged in', () => {
    it('should receive ForbiddenError if user is logged in with insufficient privilege level', async () => {
      const productParams = generateProductParams({})
      const dummyProductId = mongoose.Types.ObjectId().toString()

      const res = await request(app)
        .put(`${API_PREFIX}/products/${dummyProductId}`)
        .field('name', productParams.name)
        .field('category', productParams.description)
        //.attach('image1', 'path/to/felix.jpeg')
        //.attach('image2', imageBuffer, 'luna.jpeg')
        .expect(403)

      expect(res.body).to.have.property('err').to.eq('ForbiddenError')
      expect(res.body).to.have.property('errmsg').to.eq('Forbidden access')
    })
  })
})