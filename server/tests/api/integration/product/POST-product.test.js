import { expect } from 'chai'
import request from 'supertest'
import app from '../../../../src/app.js'
import config from '../../../../src/libs/config/index.js'
import User from '../../../../src/user/user.model.js'
import Product from '../../../../src/product/product.model.js'
import Category from '../../../../src/category/category.model.js'
import { generateUserParams } from '../../../factories/userFactory.js'
import { generateProductParams } from '../../../factories/productFactory.js'

const API_PREFIX = config.get('app:api_prefix')

describe(`POST $(API_PREFIX}/product`, () => {
  before(async () => {
    await Category.deleteMany({ "name": /^category*/ })
    await Category.create({ "name": 'category1' })
  })

  after(async () => {
    await Category.deleteMany({ "name": /^category*/ })
  })

  beforeEach(() => {

  })

  context('Admin logged in', () => {
    const admin = generateUserParams({ userProfile: 'validAdmin1' })
    let accessToken = ''
    let refreshToken = ''
    const loginHash = 'admindummyhash'

    before(async () => {
      try {
        await User.deleteMany({ "username": /^admin*/ })
        await Product.deleteMany({ "name": /^product*/ })
  
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
      await Product.deleteMany({ "name": /^product*/  })
      await request(app)
        .get(API_PREFIX + '/logout')
        .set('Accept', 'application/json')
    })

    beforeEach(async () => {
      try {
        await Product.deleteMany({ "name": /^product*/  })     
      } catch(err) {
        console.log(err)
      }
    })

    it('should create product successfully with valid product params', async () => {
      const product = generateProductParams({})

      const res = await request(app)
        .post(API_PREFIX + '/product')
        .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
        .field('name', product.name)
        .field('description', product.description)
        .field('price', product.price)
        .field('category', product.category)
        //.attach('image1', 'path/to/felix.jpeg')
        //.attach('image2', imageBuffer, 'luna.jpeg')
        .expect(201)

      expect(res.body.data).to.exist
      expect(res.body.data).to.have.property('name').to.eq(product.name)
      expect(res.body.data).to.have.property('description').to.eq(product.description)
      expect(res.body.data).to.have.property('price').to.eq(product.price)
      expect(res.body.data).to.have.property('category').to.eq(product.category)
      expect(res.body.data).to.not.have.property('quantity')
      expect(res.body.data).to.have.property('sold').to.eq(0)
      expect(res.body.data).to.not.have.property('shipping')
      expect(res.body.data).to.not.have.property('photo')
    })

    it('should create product successfully with full valid product params', async () => {
      const product = generateProductParams({ productProfile: 'full' })
      const res = await request(app)
        .post(API_PREFIX + '/product')
        .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
        .field('name', product.name)
        .field('description', product.description)
        .field('price', product.price)
        .field('category', product.category)
        .field('quantity', product.quantity)
        .field('sold', product.sold)
        .field('shipping', product.shipping)
        //.attach('image1', 'path/to/felix.jpeg')
        //.attach('image2', imageBuffer, 'luna.jpeg')
        .expect(201)

      expect(res.body.data).to.exist
      expect(res.body.data).to.have.property('name').to.eq(product.name)
      expect(res.body.data).to.have.property('description').to.eq(product.description)
      expect(res.body.data).to.have.property('price').to.eq(product.price)
      expect(res.body.data).to.have.property('category').to.eq(product.category)
      expect(res.body.data).to.have.property('quantity').to.eq(product.quantity)
      expect(res.body.data).to.property('sold').to.eq(product.sold)
      expect(res.body.data).to.have.property('shipping').to.eq(product.shipping)
      expect(res.body.data).to.not.have.property('photo')  
    })

    it('should receive BadRequestError with empty product name, description, price, or cateogory name', async () => {
      const product = generateProductParams({ productProfile: 'empty' })
      const res = await request(app)
        .post(API_PREFIX + '/product')
        .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
        //.send({ name: categoryName1 })
        //.set('Accept', 'application/json')
        .field('name', product.name)
        .field('category', product.category)
        //.attach('image1', 'path/to/felix.jpeg')
        //.attach('image2', imageBuffer, 'luna.jpeg')
        .expect(400)

      expect(res.body).to.have.property('err').to.eq('BadRequestError')
    })

    it('should receive BadRequestError with valid product params with cateogory name not found in db', async () => {
      const product = generateProductParams({})
      product['category'] = 'category2'

      const res = await request(app)
        .post(API_PREFIX + '/product')
        .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
        .field('name', product.name)
        .field('description', product.description)
        .field('price', product.price)
        .field('category', product.category)
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
        await Product.deleteMany({ "name": /^product*/  })
  
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
      await Product.deleteMany({ "name": /^product*/  })

      await request(app)
        .get(API_PREFIX + '/logout')
        .set('Accept', 'application/json')
    })

    it('should receive ForbiddenError if user is logged in with insufficient privilege level', async () => {
      const product = generateProductParams({})

      const res = await request(app)
        .post(API_PREFIX + '/product')
        .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
        .field('name', product.name)
        .field('description', product.description)
        .field('price', product.price)
        .field('category', product.category)
        //.attach('image1', 'path/to/felix.jpeg')
        //.attach('image2', imageBuffer, 'luna.jpeg')
        .expect(403)

      expect(res.body).to.have.property('err').to.eq('ForbiddenError')
      expect(res.body).to.not.have.property('data')
    })
  })

  context('User not logged in', () => {
    it('should receive ForbiddenError if user is not logged in', async () => {
      const product = generateProductParams({})

      const res = await request(app)
        .post(API_PREFIX + '/product')
        .field('name', product.name)
        .field('description', product.description)
        .field('price', product.price)
        .field('category', product.category)
        //.attach('image1', 'path/to/felix.jpeg')
        //.attach('image2', imageBuffer, 'luna.jpeg')
        .expect(403)

      expect(res.body).to.have.property('err').to.eq('ForbiddenError')
      expect(res.body).to.not.have.property('data')
    })
  })
})