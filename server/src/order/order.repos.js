import Repos from '../repos/index.js'


export default class ProductRepos extends Repos {
  constructor(model) {
    super(model)
  }

  getStatusValues() {
    return this.model.schema.path('status').enumValues
  }

  async updateOrderStatus(orderId, status) {
    const filterParams = { _id: orderId }
    const updateParams = { $set: { status }}
    return this.model.update(filterParams, updateParams)
  }
}
