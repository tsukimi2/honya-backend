import BadRequestError from "../errors/BadRequestError.js"
import NotFoundError from "../errors/NotFoundError.js"
import UnprocessableEntityError from "../errors/UnprocessableEntityError.js"

const orderController = ({ orderService }) => {
  const create = (req, res, next) => {
    if(!req.body.order) {
      return next(new BadRequestError('Missing order'))
    }
    if(!(req.auth && req.auth._id)) {
      return next('Missing user ID')
    }
    const orderData = {...req.body.order, user: req.auth._id}

    // save order
    try {
      const order = orderService.createOrder(orderData)
      return res.status(200).json(order)
    } catch(err) {
      return next(new UnprocessableEntityError('Failed to create order'))
    }
  }

  const listOrders = async (req, res, next) => {
    try {
      const orders = await orderService.listOrders()
      return res.status(200).json({ orders })
    } catch(err) {
console.log('err')      
console.log(err)
      return next(new NotFoundError('orders not found', { err }))
    }
  }

  return {
    create,
    listOrders,
  }
}

export default orderController