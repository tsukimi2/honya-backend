import sinon from 'sinon'
import chai from 'chai'
const expect = chai.expect
import sinonChai from 'sinon-chai'
import _ from 'lodash'
import CategoryService from '../../../../src/category/category.service.js'
import ApplicationError from '../../../../src/errors/ApplicationError.js'
import { generateCategoryParams } from '../../../factories/categoryFactory.js'

chai.use(sinonChai)
const sandbox = sinon.createSandbox()

describe('Category service', () => {
  const dummyid = 'dummyid'
  let categoryParams = generateCategoryParams({})
  let actualCategory = null
  let err = null

  const categoryRepos = {
    getById: (id) => {
      return Object.assign({}, categoryParams, { _id: dummyid })
    },
    create: async (params) => {
      if(!params || _.isEmpty(params)) {
        throw new ApplicationError('Invalid category params')
      }

      return Object.assign({}, params, { _id: dummyid })
    }
  }
  const categoryService = CategoryService({ categoryRepos })

  beforeEach(() => {
    categoryParams = generateCategoryParams({})
    actualCategory = null
    err = null
  })

  context('Get category', () => {
    context('getCategoryById', () => {
      it('should get category with valid category id', async () => {
        try {
          actualCategory = await categoryService.getCategoryById(dummyid)
        } catch(e) {
          err = e
        }

        expect(actualCategory).to.not.be.null
        expect(actualCategory).to.have.property('_id').to.equal(dummyid)
        expect(actualCategory).to.have.property('name').to.equal(categoryParams.name)
      })
    })
  })

  context('Create category', () => {
    context('createCategory', () => {
      it('should create category successfully and return created category with valid params', async () => {
        let actualCategory = null

        try {
          actualCategory = await categoryService.createCategory(categoryParams)
        } catch(e) {
          err = e
        }

        expect(actualCategory).to.be.not.null
        expect(actualCategory).to.have.property('_id').to.eq(dummyid)
        expect(actualCategory).to.have.property('name').to.eq(categoryParams.name)
      })

      it('should throw ApplicationError with empty params', async () => {
        const categoryParams = {}

        try {
          await categoryService.createCategory(categoryParams)
        } catch(e) {
          err = e
        }

        expect(err).to.be.not.null
        expect(err).to.be.an.instanceof(ApplicationError)
      })

      it('should throw ApplicationError with null params', async () => {
        const categoryParams = null

        try {
          await categoryService.createCategory(categoryParams)
        } catch(e) {
          err = e
        }

        expect(err).to.be.not.null
        expect(err).to.be.an.instanceof(ApplicationError)
      })
    })
  })
})