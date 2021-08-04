import BadRequestError from '../errors/BadRequestError.js'
import NotFoundError from '../errors/NotFoundError.js'
import UnprocessableEntityError from '../errors/UnprocessableEntityError.js'
import { DISPLAY } from '../libs/constants.js'
import logger from '../libs/logger/index.js'

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

  const getProductById = async (req, res, next) => {
    const { id } = req.params
    let product = null

    if(!id) {
      return next(new BadRequestError('invalid product id'))
    }

    try {
      product = await productService.getProductById(id, { populatePath: 'category', lean: true })
      product.photo = undefined
    } catch(err) {      
      return next(new NotFoundError('product not found'))
    }

    return res.status(200).json({
      data: {
        product
      }
    })
  }

  /**
 * sell / arrival
 * by sell = /products?sortBy=sold,name&order=desc,asc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */
  const getProducts = async (req, res, next) => { 
    const order = req.query.order ? req.query.order : ''
    const sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    const limit = req.query.limit ? parseInt(req.query.limit) : DISPLAY.LIMIT.DEFAULT
    let products = null

    try {
      products = await productService.getProducts({}, {
        selectParams: '-photo',
        populatePath: 'category',
        sortBy,
        order,
        limit: parseInt(limit),
      })
    } catch(err) {
      logger.error(err)
      return next(new NotFoundError('product not found'), { err })
    }

    if(!products || (Array.isArray(products) && products.length === 0)) {
      return next(new NotFoundError('product not found'))
    }

    return res.status(200).json({
      data: {
        products
      }
    })
  }

  const getRelatedProducts = async (req, res, next) => {
    const { productId }  = req.params
    const limit = req.query.limit ? parseInt(req.query.limit) : DISPLAY.LIMIT.DEFAULT
    let products = []

    try {
      products = await productService.getRelatedProducts(productId, { limit, lean: true })
    } catch(err) {
      return next(new NotFoundError('product not found'), { err })
    }

    if(!products || (Array.isArray(products) && products.length === 0)) {
      return next(new NotFoundError('product not found'))
    }

    return res.status(200).json({
      data: {
        products
      }
    })
  }

  const listCategories = async (req, res, next) => {
    let categories = []

    try {
      categories = await productService.listCategories()
    } catch(err) {
      return next(new NotFoundError('product categories not found'))
    }

    return res.status(200).json({
      data: {
        categories
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
        
        const { _id, name, description, price, category, quantity, sold, shipping } = product
        let result = {
          _id,
          name,
          description,
          price,
          category,
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

  const updateProduct = async (req, res, next) => {
    try {
      const { id } = req.params
      const form = new IncomingForm({ keepExtensions: true })
      form.parse(req, async (err, fields, files) => {
        if(err) {
          return next(new UnprocessableEntityError('failed to update product'), { err })
        }

        // validate product input
        /*
        const validationResult = validateProductInput(fields)
        if(!validationResult.isValid) {
          return next(new BadRequestError(validationResult.errmsg))
        }
        */
  
        let product = null
        const updateParams = Object.assign({}, fields)
        try {
          product = await productService.updateProduct({ _id: id }, updateParams, files)
        } catch(e) {
          return next(new UnprocessableEntityError('failed to update product'), { err: e })
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

        return res.status(200).json({
          data: result
        })
      })
    } catch(err) {
      return next(new UnprocessableEntityError('failed to update product'), { err })
    }

    return   
  }

  const deleteProduct = async (req, res, next) => {
    const { productId } = req.params
    let result = null

    try {
      result = await productService.deleteProduct({  _id: productId })
    } catch(err) {
      return next(new NotFoundError('failed to delete product'), { err })
    }
    
    if(!result || !(result && result.deletedCount !== 0)) {
      return next(new NotFoundError('failed to delete product'))
    }

    return res.status(204).end()
  }

  return {
    getProductById,
    getProducts,
    getRelatedProducts,
    listCategories,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}

export default productController