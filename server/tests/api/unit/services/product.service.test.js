import sinon from 'sinon'
import chai from 'chai'
const expect = chai.expect
import sinonChai from 'sinon-chai'
import _ from 'lodash'
import ProductService from '../../../../src/product/product.service.js'
import ApplicationError from '../../../../src/errors/ApplicationError.js'

chai.use(sinonChai)
const sandbox = sinon.createSandbox()

describe('Product service', () => {
  const dummyid = 'dummyid'
  const repos = {
    create: async (params) => {
      if(!params || _.isEmpty(params)) {
        throw new ApplicationError('Invalid user params')
      }
  
      return Object.assign({}, params, { _id: dummyid })
    }
  }
  const productService = ProductService({ repos })
  let productParams = null
  let err = null

  beforeEach(() => {
    productParams = {
      name: 'product1',
      description: 'dummydesc',
      price: 65.00,
//      category: mongoose.Types.ObjectId(),
    }
    err = null
  })

  afterEach(() => {
    sandbox.restore()
  })

  context('Create product', () => {
    context('create', () => {
      it('should create product successfully and return created product with valid params', async () => {

      })

      it('should throw ApplicationError with empty params')
      it('should throw ApplicationError with null params')
    })
  })
})


const dummyid = 'dummyid'
const categoryRepos = {
  createCategory: async (params) => {
    if(!params || _.isEmpty(params)) {
      throw new ApplicationError('Invalid user params')
    }

    return Object.assign({}, params, { _id: dummyid })
  }
}
const categoryService = CategoryService({ categoryRepos })
let categoryParams = null
let err = null