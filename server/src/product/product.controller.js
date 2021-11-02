import mongoose from 'mongoose'
import BadRequestError from '../errors/BadRequestError.js'
import NotFoundError from '../errors/NotFoundError.js'
import UnprocessableEntityError from '../errors/UnprocessableEntityError.js'
import { DISPLAY } from '../libs/constants.js'


const productController = ({ productService, config, logger, database }) => {
  const validateProductInput = (fields) => {
    const { name, description, price, category, quantity, sold, shipping } = fields

    if (!name || !price || !category) {
      return {
        isValid: false,
        errmsg: 'product name, price, and category name are all required'
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
/*
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
  */

  const getProducts = async (req, res, next) => {
    const query = {}
    // assign search value to query.name
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' }
      // assigne category value to query.category
      if(req.query.category && req.query.category !== 'All') {
        query.category = req.query.category
      }
    }

    const order = req.query.order ? req.query.order : ''
    const sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    const limit = req.query.limit ? parseInt(req.query.limit) : DISPLAY.LIMIT.DEFAULT
    let products = null

    try {
      products = await productService.getProducts(query, {
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

  const listBySearch = async (req, res, next) => {
    let products = []
    let productsSize = 0
    const { filters } = req.body
    const opts = {
      order: req.body.order ? req.body.order : DISPLAY.ORDER.DESC,
      sortBy: req.body.sortBy ? req.body.sortBy : '_id',
      limit: req.body.limit ? parseInt(req.body.limit) : DISPLAY.LIMIT.DEFAULT,
      skip: req.body.skip ? parseInt(req.body.skip) : 0,
      lean: true,
    }

    try {
      products = await productService.listBySearch(filters, opts)
    } catch(err) {
      return next(new NotFoundError('product meeting search criteria not found'), { err })
    }

    if(!products || !(products && Array.isArray(products) && products.length !== 0)) {
      return next(new NotFoundError('product meeting search criteria not found'))
    }

    try {
      const countOpts = {
        count: true
      }
      productsSize = await productService.listBySearch(filters, countOpts)
    } catch(err) {
      return next(new NotFoundError('product meeting search criteria not found'))
    }

    return res.status(200).json({
      data: {
        products,
        size: productsSize
      }
    })
  }

  const getPhoto = async (req, res, next) => {
    /*
    const { productId } = req.params
    let photo = null
    const opts = { lean: true }

    try {
      photo = await productService.getPhoto(productId, opts)
    } catch(err) {
      return next(new NotFoundError('product photo not found'), { err })
    }

    if(!photo || (photo && (!photo.data || !photo.contentType))) {
      return next(new NotFoundError('product photo not found'))
    }

    res.set('Content-Type', photo.contentType)
    return res.status(200).send(photo.data)
    */
    const dburi = `mongodb://${config.get('db:mongo:host')}:${config.get('db:mongo:port')}/${config.get('db:mongo:schema')}`
    const gfs = database.getGfsConnection(dburi)

    const { productId } = req.params
    // let photo = null
    const opts = { lean: true }

    try {
      const photoId = await productService.getPhoto(productId, opts)
      const files = await gfs.find({ _id: photoId }).toArray()

      if(!files[0] || files.length === 0) {
        return next(new NotFoundError('product photo not found'))
      }
      const file = files[0]
      if(!(file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/svg+xml')) {
        return next(new NotFoundError('product photo not an image'))
      }

      gfs.openDownloadStream(photoId).pipe(res)
    } catch(err) {
      return next(new NotFoundError('product photo not found'), { err })
    }
  }

  /*
  const photo = async (req, res, next) => {
    const { productId } = req.params

    try {
      let product = await productService.getProductById(productId, { populatePath: 'category', lean: true })
      req['product'] = product
      res.set('Content-Type', req.product.photo.contentType);
      return res.send(req.product.photo.data);
    } catch(err) {
      console.log('err')
      console.log(err)
    }

    next()
  }

  const createProduct = async (req, res, next) => {
    try {
      const form = new IncomingForm({ keepExtensions: true })
      //form.keepExtensions = true
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
*/

/*
  const createProduct = async (req, res, next) => {
    try {
      const form = new IncomingForm({ keepExtensions: true })
      //form.keepExtensions = true
      form.parse(req, async (err, fields, files) => {
        if(err) {
          return next(new UnprocessableEntityError('failed to create product'), { err })
        }

        // validate product input
        const validationResult = validateProductInput(fields)
        if(!validationResult.isValid) {
          return next(new BadRequestError(validationResult.errmsg))
        }

        // upload photo
        try {
          await upload(req, res)

console.log(req.file)
          if (req.file == undefined) {
            throw new BadRequestError('no file has been selected')
          }

          logger.info('File has been uploaded')
        } catch(err) {
          throw new UnprocessableEntityError('Error when trying upload image', { err })
        }
        
        let product = null
        try {
          product = await productService.createProduct(fields, files, req.file.id)
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
  */

  const createProduct = async (req, res, next) => {
    if(!req || !req.file || !req.file.id) {
      throw new BadRequestError('no file has been selected')
    }

    const file = req.file
    const fields = req.body

    try {
      // validate product input
      const validationResult = validateProductInput(fields)
      if(!validationResult.isValid) {
        return next(new BadRequestError(validationResult.errmsg))
      }
    } catch(err) {
      return next(new BadRequestError('BadRequestError', { err }))
    }

    let product = null
    try {    
      product = await productService.createProduct(fields, req.file.id)

      return res.status(201).json({
        product
      })
    } catch(err) {
      return next(new UnprocessableEntityError('failed to create product'), { err })
    }
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
  }

  const deleteProduct = async (req, res, next) => {
    const { productId } = req.params
    let result = null
    let product = null

    try {
      product = await productService.getProductById(productId)
    } catch(err) {
      return next(new NotFoundError('product to delete does not exist'), { err })
    }

    const dburi = `mongodb://${config.get('db:mongo:host')}:${config.get('db:mongo:port')}/${config.get('db:mongo:schema')}`
    const gfs = database.getGfsConnection(dburi)
    try {
      const { photo:photoId } = product
      gfs.delete(new mongoose.Types.ObjectId(photoId))
      logger.info(`Photo chunks with file id ${photoId} deleted successfully`)
    } catch(err) {
      return next(new NotFoundError('failed to delete photo', { err }))
    }

    try {
      result = await productService.deleteProduct({ _id: productId })
    } catch(err) {
      return next(new NotFoundError('failed to delete product'), { err })
    }
    
    if(!result || !(result && result.deletedCount !== 0)) {
      return next(new NotFoundError('failed to delete product'))
    }

    return res.status(204).end()
  }

  const decreaseQuantity = async (req, res, next) => {
    if(!(req.body && req.body.order && req.body.order.products)) {
      return next(new UnprocessableEntityError('Failed to update product quantity due to missing products in order'))
    }

    const { products } = req.body.order
    try {
      await productService.decreaseQuantity(products)
    } catch(err) {
      return next(new UnprocessableEntityError('Failed to update product quantity'), { err })
    }

    next()
  }

  return {
    getProductById,
    getProducts,
    getRelatedProducts,
    listCategories,
    listBySearch,
    getPhoto,
    //create,
    //photo,
    createProduct,
    updateProduct,
    deleteProduct,
    decreaseQuantity,
  }
}

export default productController