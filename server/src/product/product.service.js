import util from 'util'
import ApplicationError from '../errors/ApplicationError.js'
import BadRequestError from '../errors/BadRequestError.js'
import BaseError from '../errors/BaseError.js'

const productService = ({ productRepos, categoryRepos, config, fs, mongoose }) => {
  const createProduct = async (params, files) => {
console.log('product service createProduct')

    try {
      const { category } = params

      // find category the new product is intended to belong to
      const categoryId = await categoryRepos.getOne({ name: category }, {
        selectParams: [ '_id' ],
        lean: true
      })
console.log('categoryId')
console.log(categoryId)
      params.category = categoryId
  
      // put photo into params
      if(files.photo) {
        if(files.photo.size > config.get('app:img:max_img_size')) {
          throw new BadRequestError('photo max size exceeded')
        }
  
        const readFile = util.promisify(fs.readFile)
        const photoData = await readFile(files.photo.path)
  
        params['photo'] = {
          data: photoData,
          contentType: files.photo.type
        }
      }
  
      // save product
      return productRepos.create(params)
    } catch(err) {
console.log('product service err')      
console.log(err)
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
