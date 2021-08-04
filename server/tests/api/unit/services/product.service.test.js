import mongoose from 'mongoose'
import sinon from 'sinon'
import chai from 'chai'
const expect = chai.expect
import sinonChai from 'sinon-chai'
import _ from 'lodash'
import ProductService from '../../../../src/product/product.service.js'
import ApplicationError from '../../../../src/errors/ApplicationError.js'
import { generateProductParams } from '../../../factories/productFactory.js'
import NotFoundError from '../../../../src/errors/NotFoundError.js'
import DatabaseError from '../../../../src/errors/DatabaseError.js'

chai.use(sinonChai)
const sandbox = sinon.createSandbox()

describe('Product service', () => {
  const dummyid = 'dummyid'
  let productParams = generateProductParams({})
  let actualResult = null

  let productRepos = null
  const dummyCategoryId = mongoose.Types.ObjectId()
  let categoryRepos = null
  const config = {
    get: () => config.get('app:img:max_img_size')
  }
  const fs = {
    readFile: async () => ({})
  }
  let productService = null
  let err = null

  beforeEach(() => {
    productParams = generateProductParams({})
    actualResult = null
    err = null

    productRepos = {
      getById: (id) => {
        if(!id) {
          throw new ApplicationError('Invalid product id')
        }
        return Object.assign({}, productParams, { _id: dummyid, sold: 0 })
      },
      getRelatedProducts: (productId, opts={}) => {
        return [ Object.assign({}, productParams, { _id: dummyid, sold: 0 }) ]
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

    categoryRepos = {
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

    productService = ProductService({ productRepos, categoryRepos, config, fs })
  })

  afterEach(() => {
    sandbox.restore()
  })

  context('Get product', () => {
    context('getProductById', () => {
      it('should get product with valid product id', async () => {
        const expectedProduct = productParams
        const productService = ProductService({ productRepos, categoryRepos, config, fs })

        try {
          actualResult = await productService.getProductById(dummyid)
        } catch(e) {
          err = e
        }
   
        expect(actualResult).to.not.be.null
        expect(actualResult).to.have.property('_id').to.equal(dummyid)
        expect(actualResult).to.have.property('name').to.equal(expectedProduct.name)
        expect(actualResult).to.have.property('description').to.equal(expectedProduct.description)
        expect(actualResult).to.have.property('category').to.equal(expectedProduct.category)
        expect(actualResult).to.have.property('price').to.equal(expectedProduct.price)
      })

      it('should throw ApplicationError with empty product id', async () => {
        const dummyid = ''
        const productService = ProductService({ productRepos, categoryRepos, config, fs })

        try {
          actualResult = await productService.getProductById(dummyid)
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
          actualResult = await productService.getProductById(dummyid)
        } catch(e) {
          err = e
        }

        expect(err).to.be.not.null
        expect(err).to.be.an.instanceof(ApplicationError)
      })
    })

    context('getRelatedProducts', () => {
      it('should get related products with valid product id', async () => {
        try {
          actualResult = await productService.getRelatedProducts(dummyid)
        } catch(e) {
          err = e
        }

        expect(actualResult).to.be.an('array').to.have.length(1)
      })

      it('should throw NotFoundError when current book not found', async () => {
        productRepos['getById'] = (params) => { return null }

        try {
          actualResult = await productService.getRelatedProducts(dummyid)
        } catch(e) {
          err = e
        }

        expect(err).to.be.not.null
        expect(err).to.be.an.instanceof(NotFoundError)
        expect(err).to.have.property('message').to.eq('no related products found')
      })

      it('should throw DatabaseError with db error', async () => {
        productRepos['getById'] = (params) => { throw new Error() }

        try {
          actualResult = await productService.getRelatedProducts(dummyid)
        } catch(e) {
          err = e
        }

        expect(err).to.be.not.null
        expect(err).to.be.an.instanceof(DatabaseError)
      })
    })
  })

  context('Create product', () => {
    context('create', () => {
      it('should create product without photo successfully and return created product with valid params', async () => {
        try {
          actualResult = await productService.createProduct(productParams)
        } catch(e) {
          err = e
        }

        expect(actualResult).to.be.not.null
        expect(actualResult).to.have.property('_id')
        expect(actualResult).to.have.property('name').to.eq(productParams.name)
        expect(actualResult).to.have.property('description').to.eq(productParams.description)
        expect(actualResult).to.have.property('price').to.eq(productParams.price)
        expect(actualResult).to.have.property('category')
        expect(actualResult).to.not.have.property('quantity')
        expect(actualResult).to.not.have.property('sold')
        expect(actualResult).to.not.have.property('shipping')
        expect(actualResult).to.not.have.property('photo')
      })

      it('should create product without photo successfully and return created product with valid full params', async () => {     
        productParams['quantity'] = 2
        productParams['sold'] = 3
        productParams['shipping'] = true
        
        try {
          actualResult = await productService.createProduct(productParams)     
        } catch(e) {
          err = e
        }

        expect(actualResult).to.be.not.null
        expect(actualResult).to.have.property('_id')
        expect(actualResult).to.have.property('name').to.eq(productParams.name)
        expect(actualResult).to.have.property('description').to.eq(productParams.description)
        expect(actualResult).to.have.property('price').to.eq(productParams.price)
        expect(actualResult).to.have.property('category')
        expect(actualResult).to.have.property('quantity').to.eq(productParams.quantity)
        expect(actualResult).to.have.property('sold').to.eq(productParams.sold)
        expect(actualResult).to.have.property('shipping').to.eq(productParams.shipping)
        expect(actualResult).to.not.have.property('photo')
      })
    })
  })

  context('Update product', () => {
    it('should update product successfully and return created product with valid filter and update params', async () => {
      const filterParams = { _id: 'dummy1' }
      const updateParams = productParams

      try {
        actualResult = await productService.updateProduct(filterParams, updateParams)
      } catch(e) {
        err = e
      }

      expect(actualResult).to.be.not.null
      expect(actualResult).to.have.property('_id')
      expect(actualResult).to.have.property('name').to.eq(productParams.name)
      expect(actualResult).to.have.property('description').to.eq(productParams.description)
      expect(actualResult).to.have.property('price').to.eq(productParams.price)
      expect(actualResult).to.have.property('category')
      expect(actualResult).to.not.have.property('quantity')
      expect(actualResult).to.not.have.property('sold')
      expect(actualResult).to.not.have.property('shipping')
      expect(actualResult).to.not.have.property('photo')      
    })
  })

  context('Delete product', () => {
    it('should delete product successfully with valid params', async () => {
      const params = { _id: 'dummyid' }
      try {
        actualResult = productService.deleteProduct(params)
      } catch(e) {
        err = e
      }

      expect(actualResult).to.be.not.null
    })

    it('should throw ApplicationError with empty params', async () => {
      const params = {}

      try {
        actualResult = await productService.deleteProduct(params)
      } catch(e) {
        err = e
      }

      expect(err).to.be.an.instanceof(ApplicationError)
    })

    it('should throw ApplicationError with null params', async () => {
      const params = null

      try {
        actualResult = await productService.deleteProduct(params)
      } catch(e) {
        err = e
      }

      expect(err).to.be.an.instanceof(ApplicationError)
    })
  })
})
