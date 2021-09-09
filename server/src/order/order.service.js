import { DISPLAY } from "../libs/constants.js"

const orderService = ({ orderRepos }) => {
  const createOrder = (params) => {
    return orderRepos.create(params)
  }

  const listOrders = async () => {
    const filterParams = {}
    const opts = {
      populatePath: 'user',
      populateSelect: '_id name address',
      sortBy: 'created',
      order: DISPLAY.ORDER.DESC
    }
    return orderRepos.get(filterParams, opts)
  }

  return {
    createOrder,
    listOrders,
  }
}

export default orderService