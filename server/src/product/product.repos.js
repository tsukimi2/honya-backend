import Repos from '../repos/index.js'
import mongoose from 'mongoose'

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
}