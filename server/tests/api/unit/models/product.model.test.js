import chai from 'chai'
import mongoose from 'mongoose'
import Product from '../../../../src/product/product.model.js'

const expect = chai.expect

describe('Product model', () => {
  let productParams = null
  const categoryId = mongoose.Types.ObjectId()

  beforeEach(() => {
    productParams = {
      name: 'product1',
      description: 'description',
      price: 65.00,
      category: categoryId
    }
  })

  context('Test model validation', () => {
    it('should be valid with valid category params', (done) => {
      const product = new Product(productParams)
      product.validate((err) => {
        expect(err).to.not.exist
        done()
      })
    })

    context('Testing name', () => {
      it('should be invalid with empty name', (done) => {
        productParams['name'] = ''
        const product = new Product(productParams)

        product.validate((err) => {
          expect(err).to.exist
          expect(err.errors).to.exist
          expect(err.errors).to.have.property('name')
          expect(err.errors.name).to.have.property('kind').to.eq('required')
          done()
        })
      })

      it('should be invalid with length greater than 32 characters', (done) => {
        productParams['name'] = '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901'
        const product = new Product(productParams)

        product.validate((err) => {
          expect(err).to.exist
          expect(err.errors).to.exist
          expect(err.errors).to.have.property('name')
          expect(err.errors.name).to.have.property('kind').to.eq('maxlength')
          done()
        })
      })
    })

    context('Testing price', () => {
      it('should be invalid with string', (done) => {
        productParams['price'] = 'dummyprice'
        const product = new Product(productParams)

        product.validate((err) => {
          expect(err).to.exist
          expect(err.errors).to.exist
          expect(err.errors).to.have.property('price')
          expect(err.errors.price).to.have.property('kind').to.eq('Number')
          done()
        })
      })

      it('should be invalid with empty price', (done) => {
        productParams['price'] = ''
        const product = new Product(productParams)

        product.validate((err) => {
          expect(err).to.exist
          expect(err.errors).to.exist
          expect(err.errors).to.have.property('price')
          expect(err.errors.price).to.have.property('kind').to.eq('required')
          done()
        })
      })
    })

    context('Testing quantity', () => {
      it('should be invalid with string', (done) => {
        productParams['quantity'] = 'two'
        const product = new Product(productParams)

        product.validate((err) => {
          expect(err).to.exist
          expect(err.errors).to.exist
          expect(err.errors).to.have.property('quantity')
          expect(err.errors.quantity).to.have.property('kind').to.eq('Number')
          done()
        })
      })
    })

    context('Testing sold', () => {
      it('should be invalid with string', (done) => {
        productParams['sold'] = 'two'
        const product = new Product(productParams)

        product.validate((err) => {
          expect(err).to.exist
          expect(err.errors).to.exist
          expect(err.errors).to.have.property('sold')
          expect(err.errors.sold).to.have.property('kind').to.eq('Number')
          done()
        })
      })
    })

    context('Testing shipping', () => {
      it('should be invalid with string', (done) => {
        productParams['shipping'] = 'hai'
        const product = new Product(productParams)

        product.validate((err) => {
          expect(err).to.exist
          expect(err.errors).to.exist
          expect(err.errors).to.have.property('shipping')
          expect(err.errors.shipping).to.have.property('kind').to.eq('Boolean')
          done()
        })
      })

      it('should be invalid with number', (done) => {
        productParams['shipping'] = 3
        const product = new Product(productParams)

        product.validate((err) => {
          expect(err).to.exist
          expect(err.errors).to.exist
          expect(err.errors).to.have.property('shipping')
          expect(err.errors.shipping).to.have.property('kind').to.eq('Boolean')
          done()
        })
      })
    })
  })
})
