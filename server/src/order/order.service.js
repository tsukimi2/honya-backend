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

  const getStatusValues = () => {
    return orderRepos.getStatusValues()
  }

  const updateOrderStatus = async (orderId, status) => {
    return orderRepos.updateOrderStatus(orderId, status)
  }

  const getOrderHistory = async (uid) => {
    const filterParams = { user: uid }
    const opts = {
      populatePath: 'user',
      populateSelect: '_id name',
      sortBy: 'createdAt',
      order: DISPLAY.ORDER.DESC,
    }
    return orderRepos.get(filterParams, opts)
  }

/*
exports.purchaseHistory = (req, res) => {
    Order.find({ user: req.profile._id })
        .populate('user', '_id name')
        .sort('-created')
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(orders);
        });
};
*/  

  return {
    createOrder,
    listOrders,
    getStatusValues,
    updateOrderStatus,
    getOrderHistory,
  }
}

export default orderService