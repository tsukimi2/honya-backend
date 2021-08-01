import UnprocessableEntityError from '../errors/UnprocessableEntityError.js'

const productController = ({ productService, IncomingForm }) => {
  const createProduct = async (req, res, next) => {
    try {
      const form = new IncomingForm({ keepExtensions: true })
      form.parse(req, async (err, fields, files) => {
        if(err) {
          return next(new UnprocessableEntityError('failed to create product'), { err })
        }
  
        let product = null
        try {
          product = await productService.createProduct(fields, files)
        } catch(e) {
console.log('product controller err')          
console.log(e)
          return next(new UnprocessableEntityError('failed to create product'), { err: e })
        }
console.log('kon')  
        return res.status(201).json({
          data: {
            product
          }
        })
      })
    } catch(err) {
      return next(new UnprocessableEntityError('failed to create product'), { err })
    }

    return
  }

  return {
    createProduct
  }
}

export default productController