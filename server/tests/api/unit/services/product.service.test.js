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
  const productRepos = {
    create: async (params) => {
      if(!params || _.isEmpty(params)) {
        throw new ApplicationError('Invalid user params')
      }
  
      return Object.assign({}, params, { _id: dummyid })
    }
  }
  const dummyCategoryName = 'category1'
  const categoryRepos = {
    getOne: (params) => {
      if(!params || _.isEmpty(params)) {
        throw new ApplicationError('Invalid user params')
      }
      //return Object.assign({}, params, { _id: dummyid })
      return dummyCategoryName
    },
  }
  const config = {
    get: () => config.get('app:img:max_img_size')
  }
  const fs = {
    readFile: async () => ({})
  }
  const productService = ProductService({ productRepos, categoryRepos, config, fs })
  let productParams = null
  let err = null

  beforeEach(() => {
    productParams = {
      name: 'product1',
      description: 'dummydesc',
      price: 65.00,
      category: dummyCategoryName,
    }
    err = null
  })

  afterEach(() => {
    sandbox.restore()
  })

  context('Create product', () => {
    context('create', () => {
      it('should create product without photo successfully and return created product with valid params', async () => {
        let actualProduct = null
        try {
          actualProduct = await productService.createProduct(productParams)     
        } catch(e) {
          err = e
        }

        expect(actualProduct).to.be.not.null
        expect(actualProduct).to.have.property('_id')
        expect(actualProduct).to.have.property('name').to.eq(productParams.name)
        expect(actualProduct).to.have.property('description').to.eq(productParams.description)
        expect(actualProduct).to.have.property('price').to.eq(productParams.price)
        expect(actualProduct).to.have.property('category').to.eq(productParams.category)
        expect(actualProduct).to.not.have.property('quantity')
        expect(actualProduct).to.not.have.property('sold')
        expect(actualProduct).to.not.have.property('shipping')
        expect(actualProduct).to.not.have.property('photo')
      })

      it('should create product without photo successfully and return created product with valid full params', async () => {
        productParams['quantity'] = 2
        productParams['sold'] = 3
        productParams['shipping'] = true
        
        let actualProduct = null
        try {
          actualProduct = await productService.createProduct(productParams)     
        } catch(e) {
          err = e
        }

        expect(actualProduct).to.be.not.null
        expect(actualProduct).to.have.property('_id')
        expect(actualProduct).to.have.property('name').to.eq(productParams.name)
        expect(actualProduct).to.have.property('description').to.eq(productParams.description)
        expect(actualProduct).to.have.property('price').to.eq(productParams.price)
        expect(actualProduct).to.have.property('category').to.eq(productParams.category)
        expect(actualProduct).to.have.property('quantity').to.eq(productParams.quantity)
        expect(actualProduct).to.have.property('sold').to.eq(productParams.sold)
        expect(actualProduct).to.have.property('shipping').to.eq(productParams.shipping)
        expect(actualProduct).to.not.have.property('photo')
      })
    })
  })
})
