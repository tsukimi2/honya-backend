import mongoose from 'mongoose'
import sinon from 'sinon'
import chai from 'chai'
const expect = chai.expect
import sinonChai from 'sinon-chai'
import _ from 'lodash'
import ProductService from '../../../../src/product/product.service.js'
import ApplicationError from '../../../../src/errors/ApplicationError.js'
import { generateProductParams } from '../../../factories/productFactory.js'

chai.use(sinonChai)
const sandbox = sinon.createSandbox()

describe('Product service', () => {
  const dummyid = 'dummyid'
  let productParams = generateProductParams({})
  let actualProduct = null

  const productRepos = {
    getById: (id) => {
      if(!id) {
        throw new ApplicationError('Invalid product id')
      }
      return Object.assign({}, productParams, { _id: dummyid, sold: 0 })
    },
    create: async (params) => {
      if(!params || _.isEmpty(params)) {
        throw new ApplicationError('Invalid product params')
      }
  
      return Object.assign({}, params, { _id: dummyid })
    },
    updateOne: async (filterParams, updateParams) => {
      return Object.assign({}, filterParams, updateParams)
    },
    deleteOne: async (params) => {
      if(!params || _.isEmpty(params)) {
        throw new ApplicationError('Invalid product params')
      }

      return { n: 1, ok: 1, deletedCount: 1 }
    }
  }
  const dummyCategoryId = mongoose.Types.ObjectId()
  const categoryRepos = {
    getById: (params) => {
      if(!params || _.isEmpty(params)) {
        throw new ApplicationError('Invalid category params')
      }
      return Object.assign({}, params, { _id: dummyCategoryId })
      //return dummyCategoryName
    },
    getOne: (params) => {
      if(!params || _.isEmpty(params)) {
        throw new ApplicationError('Invalid category params')
      }
      return Object.assign({}, params, { _id: dummyCategoryId })
      //return dummyCategoryName
    },
  }
  const config = {
    get: () => config.get('app:img:max_img_size')
  }
  const fs = {
    readFile: async () => ({})
  }
  const productService = ProductService({ productRepos, categoryRepos, config, fs })
  let err = null

  beforeEach(() => {
    productParams = generateProductParams({})
    actualProduct = null
    err = null
  })

  afterEach(() => {
    sandbox.restore()
  })

  context('Get product', () => {
    context('getProductById', () => {
      it('hould get product with valid product id', async () => {
        const expectedProduct = productParams
        const productService = ProductService({ productRepos, categoryRepos, config, fs })

        try {
          actualProduct = await productService.getProductById(dummyid)
        } catch(e) {
          err = e
        }
   
        expect(actualProduct).to.not.be.null
        expect(actualProduct).to.have.property('_id').to.equal(dummyid)
        expect(actualProduct).to.have.property('name').to.equal(expectedProduct.name)
        expect(actualProduct).to.have.property('description').to.equal(expectedProduct.description)
        expect(actualProduct).to.have.property('category').to.equal(expectedProduct.category)
        expect(actualProduct).to.have.property('price').to.equal(expectedProduct.price)
      })

      it('should throw ApplicationError with empty product id', async () => {
        const dummyid = ''
        const productService = ProductService({ productRepos, categoryRepos, config, fs })

        try {
          actualProduct = await productService.getProductById(dummyid)
        } catch(e) {
          err = e
        }

        expect(err).to.be.not.null
        expect(err).to.be.an.instanceof(ApplicationError)
      })

      it('should throw ApplicationError with null product id', async () => {
        const dummyid = undefined
        const productService = ProductService({ productRepos, categoryRepos, config, fs })

        try {
          actualProduct = await productService.getProductById(dummyid)
        } catch(e) {
          err = e
        }

        expect(err).to.be.not.null
        expect(err).to.be.an.instanceof(ApplicationError)
      })
    })
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
        expect(actualProduct).to.have.property('category')
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
        expect(actualProduct).to.have.property('category')
        expect(actualProduct).to.have.property('quantity').to.eq(productParams.quantity)
        expect(actualProduct).to.have.property('sold').to.eq(productParams.sold)
        expect(actualProduct).to.have.property('shipping').to.eq(productParams.shipping)
        expect(actualProduct).to.not.have.property('photo')
      })
    })
  })

  context('Update product', () => {
    it('should update product successfully and return created product with valid filter and update params', async () => {
      let actualProduct = null
      const filterParams = { _id: 'dummy1' }
      const updateParams = productParams

      try {
        actualProduct = await productService.updateProduct(filterParams, updateParams)
      } catch(e) {
        err = e
      }

      expect(actualProduct).to.be.not.null
      expect(actualProduct).to.have.property('_id')
      expect(actualProduct).to.have.property('name').to.eq(productParams.name)
      expect(actualProduct).to.have.property('description').to.eq(productParams.description)
      expect(actualProduct).to.have.property('price').to.eq(productParams.price)
      expect(actualProduct).to.have.property('category')
      expect(actualProduct).to.not.have.property('quantity')
      expect(actualProduct).to.not.have.property('sold')
      expect(actualProduct).to.not.have.property('shipping')
      expect(actualProduct).to.not.have.property('photo')      
    })
  })

  context('Delete product', () => {
    it('should delete product successfully with valid params', async () => {
      const params = { _id: 'dummyid' }
      try {
        actualProduct = productService.deleteProduct(params)
      } catch(e) {
        err = e
      }

      expect(actualProduct).to.be.not.null
    })

    it('should throw ApplicationError with empty params', async () => {
      const params = {}

      try {
        actualProduct = await productService.deleteProduct(params)
      } catch(e) {
        err = e
      }

      expect(err).to.be.an.instanceof(ApplicationError)
    })

    it('should throw ApplicationError with null params', async () => {
      const params = null

      try {
        actualProduct = await productService.deleteProduct(params)
      } catch(e) {
        err = e
      }

      expect(err).to.be.an.instanceof(ApplicationError)
    })
  })
})
