import util from 'util'
import _ from 'lodash'
import ApplicationError from '../errors/ApplicationError.js'
import BadRequestError from '../errors/BadRequestError.js'
import BaseError from '../errors/BaseError.js'
import DatabaseError from '../errors/DatabaseError.js'
import NotFoundError from '../errors/NotFoundError.js'

const productService = ({ productRepos, categoryRepos, config, fs }) => {
  const getProductById = async (id, opts={}) => {
    return productRepos.getById(id, opts)
  }

  const getProducts = async (filterParams, opts={}) => {
    return productRepos.get(filterParams, opts)
  }

  const getRelatedProducts = async (productId, opts={}) => {
    let products = []
    let relatedCategoryId = null
    let result = null

    try {
      // find category id of current book
      result = await productRepos.getById(productId, { selectParams: 'category', lean: true })
    } catch(err) {
      throw new DatabaseError('DatabaseError', { err })
    }

    if(!result || (!(result && result.category))) {
      throw new NotFoundError('no related products found')
    }
    relatedCategoryId = result.category

    try {
      // construct filterParams and opts, and
      // find related books
      products = await productRepos.getRelatedProducts(productId, relatedCategoryId, opts)
    } catch(err) {
      throw new DatabaseError('DatabaseError', { err })
    }

    return products
  }

  const listCategories = async () => {
    return productRepos.listCategories({ lean: true })
  }

  const createProduct = async (params, files) => {
    try {
      const { category } = params
      const productParams = Object.assign({}, params)

      // find category the new product is intended to belong to
      const categoryId = await categoryRepos.getById(category, {
        selectParams: [ '_id' ],
        lean: true
      })
      if(!categoryId) {
        throw new BadRequestError('product not belonged to a valid cateogry')
      }
      productParams.category = categoryId
  
      // put photo into params
      if(files && files.photo) {
        if(files.photo.size > config.get('app:img:max_img_size')) {
          throw new BadRequestError('photo max size exceeded')
        }
  
        const readFile = util.promisify(fs.readFile)
        const photoData = await readFile(files.photo.path)
  
        productParams['photo'] = {
          data: photoData,
          contentType: files.photo.type
        }
      }
  
      // save product
      return productRepos.create(productParams)
    } catch(err) {
      if(err instanceof BaseError) {
        throw err
      }

      throw new ApplicationError('ApplicationError', { err })
    }
  }

  const updateProduct = async (filterParams, updateParams, files) => {
    try {
      const productParams = Object.assign({}, updateParams)

      // find category the new product is intended to belong to
      const category = updateParams.category
      if(category) {
        const categoryId = await categoryRepos.getById(category, {
          selectParams: [ '_id' ],
          lean: true
        })
        if(!categoryId) {
          throw new BadRequestError('product not belonged to a valid cateogry')
        }
      }

      // put photo into params
      if(files && files.photo) {
        if(files.photo.size > config.get('app:img:max_img_size')) {
          throw new BadRequestError('photo max size exceeded')
        }
  
        const readFile = util.promisify(fs.readFile)
        const photoData = await readFile(files.photo.path)
  
        productParams['photo'] = {
          data: photoData,
          contentType: files.photo.type
        }
      }

      return productRepos.updateOne(filterParams, productParams)
    } catch(err) {
      if(err instanceof BaseError) {
        throw err
      }

      throw new ApplicationError('ApplicationError', { err })
    }
  }

  const deleteProduct = async (params) => productRepos.deleteOne(params)

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

export default productService
