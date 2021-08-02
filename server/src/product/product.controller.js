import BadRequestError from '../errors/BadRequestError.js'
import NotFoundError from '../errors/NotFoundError.js'
import UnprocessableEntityError from '../errors/UnprocessableEntityError.js'
import { attachObjToReqLocal } from '../libs/util.js'

const productController = ({ productService, IncomingForm }) => {
  const validateProductInput = (fields) => {
    const { name, description, price, category, quantity, sold, shipping } = fields

    if (!name || !description || !price || !category) {
      return {
        isValid: false,
        errmsg: 'product name, description, price, and category name are all required'
      }
    }
    
    return {
      isValid: true,
      errmsg: ''
    }
  }

  const getProductById = async (req, res, next, id) => {
    let product = null

    if(!id) {
      return next(new BadRequestError('invalid product id'))
    }

    try {
      product = await productService.getProductById(id, { populatePath: 'category', lean: true })
    } catch(err) {
      return next(new NotFoundError('product not found'))
    }

    // attach product to req.local
    attachObjToReqLocal(req, 'product', product)

    next()
  }

  const readProductById = async (req, res, next) => {
    if(!(req.local && req.local.product)) {
      return next(new NotFoundError('product not found'))
    }

    req.local.product.photo = undefined
    return res.status(200).json({
      data: {
        product: req.local.product
      }
    })
  }

  const createProduct = async (req, res, next) => {
    try {
      const form = new IncomingForm({ keepExtensions: true })
      form.parse(req, async (err, fields, files) => {
        if(err) {
          return next(new UnprocessableEntityError('failed to create product'), { err })
        }

        // validate product input
        const validationResult = validateProductInput(fields)
        if(!validationResult.isValid) {
          return next(new BadRequestError(validationResult.errmsg))
        }
  
        let product = null
        try {
          product = await productService.createProduct(fields, files)
        } catch(e) {
          return next(new UnprocessableEntityError('failed to create product'), { err: e })
        }
        
        const { _id, name, description, price, quantity, sold, shipping } = product
        let result = {
          _id,
          name,
          description,
          price,
          category: fields.category,
        }
        if('quantity' in product) {
          result['quantity'] = quantity
        }
        if('sold' in product) {
          result['sold'] = sold
        }
        if('shipping' in product) {
          result['shipping'] = shipping
        }
        if('photo' in product) {
          result['photo'] = product.photo.data
        }

        return res.status(201).json({
          data: result
        })
      })
    } catch(err) {
      return next(new UnprocessableEntityError('failed to create product'), { err })
    }

    return
  }

  return {
    getProductById,
    readProductById,
    createProduct
  }
}

export default productController