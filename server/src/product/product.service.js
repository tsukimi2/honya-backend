import util from 'util'
import ApplicationError from '../errors/ApplicationError.js'
import BadRequestError from '../errors/BadRequestError.js'
import BaseError from '../errors/BaseError.js'

const productService = ({ productRepos, categoryRepos, config, fs }) => {
  const createProduct = async (params, files) => {
    try {
      const { category } = params
      const productParams = Object.assign({}, params)

      // find category the new product is intended to belong to
      const categoryId = await categoryRepos.getOne({ name: category }, {
        selectParams: [ '_id' ],
        lean: true
      })
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

  return {
    createProduct
  }
}

export default productService
