import BadRequestError from "../errors/BadRequestError.js"
import UnprocessableEntityError from "../errors/UnprocessableEntityError.js"

const orderController = ({ orderService }) => {
  const create = (req, res, next) => {
console.log('req auth')
console.log(req.auth)
/*
honya-server | {
honya-server |   order: {
honya-server |     products: [ [Object] ],
honya-server |     transaction_id: 'ab1mr0vj',
honya-server |     amount: '65.00',
honya-server |     address: 'Harbour Plaza Resort City,\nTin Shu Wai'
honya-server |   }
honya-server | }
*/

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
console.log('err')      
console.log(err)
      return next(new UnprocessableEntityError('Failed to create order'))
    }
  }

  return {
    create,
  }
}

export default orderController