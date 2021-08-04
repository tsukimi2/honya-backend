import Repos from '../repos/index.js'
import mongoose from 'mongoose'
import NotFoundError from '../errors/NotFoundError.js'

export default class ProductRepos extends Repos {
  constructor(model) {
    super(model)
  }

  async getRelatedProducts(productId, categoryId, opts={}) {
    let docs = []

    // construct filterParams and opts
    const filterParams = {
      _id:  { $ne: productId },
      category: mongoose.Types.ObjectId(categoryId),
    }
    const optsParams = Object.assign({}, {
      selectParams: 'name category',
      populatePath: 'category',
      populateSelect: '_id name',
//      limit: opts.limit
    }, opts)

    // get related products    
    docs = await this.get(filterParams, optsParams)

    return docs
  }

  async listCategories(opts={}) {
    let docs = []

    docs = await this.model.distinct('category', {})
    if(!docs || (docs && Array.isArray(docs) && docs.length === 0)) {
      throw new NotFoundError('product categories not found')
    }

    return docs
  }
}