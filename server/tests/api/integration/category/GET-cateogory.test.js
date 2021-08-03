import mongoose from 'mongoose'
import { expect } from 'chai'
import request from 'supertest'
import app from '../../../../src/app.js'
import config from '../../../../src/libs/config/index.js'
import Category from '../../../../src/category/category.model.js'
import { generateCategory } from '../../../factories/categoryFactory.js'

const API_PREFIX = config.get('app:api_prefix')

describe('Get categories', () => {
  describe(`${API_PREFIX}/categories/:id`, () => {
    let storedCategory = null

    before(async () => {
      try {
        await Category.deleteMany({ "name": /^category*/ })
        storedCategory = await generateCategory({})
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
    })

    it('should return category with valid category id', async () => {
      const categoryId = storedCategory._id.toString()
      let res = null
      
      try {
        res = await request(app)
          .get(`${API_PREFIX}/categories/${categoryId}`)
          .expect(200)
      } catch(e) {
        console.log(e)
      }

      expect(res.body.data).to.exist
      expect(res.body.data.category).to.exist
      expect(res.body.data.category).to.have.property('_id').to.eq(categoryId)
      expect(res.body.data.category).to.have.property('name').to.eq(storedCategory.name)
    })

    it('should throw NotFoundError when product not found', async () => {   
      const categoryId = mongoose.Types.ObjectId().toString()
      let res = null

      try {
        res = await request(app)
          .get(`${API_PREFIX}/categories/${categoryId}`)
          .expect(404)
      } catch(e) {
        console.log(e)
      }

      expect(res.body).to.have.property('err').to.eq('NotFoundError')
      expect(res.body).to.have.property('errmsg').to.eq('category not found')
    })
  })
})
