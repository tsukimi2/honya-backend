import { expect } from 'chai'
import request from 'supertest'
import app from '../../../../src/app.js'
import config from '../../../../src/libs/config/index.js'
import User from '../../../../src/user/user.model.js'
import Product from '../../../../src/product/product.model.js'
import { generateProduct } from '../../../factories/productFactory.js'
import { generateUserParams } from '../../../factories/userFactory.js'

const API_PREFIX = config.get('app:api_prefix')

describe(`DELETE $(API_PREFIX}/product/:productId`, () => {
  context('Admin logged in', () => {
    let admin = null
    let accessToken = ''
    let refreshToken = ''
    const loginHash = 'admindummyhash'

    before(async () => {
      try {
        admin = await generateUserParams({ userProfile: 'validAdmin1' })
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

    it('should delete product successfully with valid product ID', async () => {
      let product = null

      try {
        product = await generateProduct({})
      } catch(err) {
        console.log(err)
      }

      const res = await request(app)
        .delete(`${API_PREFIX}/products/${product._id}`)
        .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
        .expect(204)

      try {
        await Product.deleteMany({ "name": /^product*/  })
      } catch(err) {
        console.log(err)
      }
    })

    it('should throw NotFoundError with no product found to be deleted', async () => {
      const productId = 'dummyid'

      const res = await request(app)
      .delete(`${API_PREFIX}/products/${productId}`)
      .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
      .expect(404)

      expect(res.body).to.have.property('err').to.eq('NotFoundError')
    })
  })

  context('User logged in', () => {
    let user = null
    let accessToken = ''
    let refreshToken = ''
    const loginHash = 'userdummyhash'

    before(async () => {
      try {
        user = await generateUserParams({ userProfile: 'validUser1' })
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
      const productId = 'dummyid'

      const res = await request(app)
        .delete(`${API_PREFIX}/products/${productId}`)
        .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
        .expect(403)

      expect(res.body).to.have.property('err').to.eq('ForbiddenError')
    })
  })

  context('Logged out', () => {
    it('should receive ForbiddenError if user is not logged in', async () => {
      const productId = 'dummyid'

      const res = await request(app)
        .delete(`${API_PREFIX}/products/${productId}`)
        .expect(403)

      expect(res.body).to.have.property('err').to.eq('ForbiddenError')
    })
  })
})