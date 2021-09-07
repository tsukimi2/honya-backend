import braintree from 'braintree'

const paymentController = ({ paymentService }) => {
  const generateToken = async (req, res, next) => {
    try {
      const response = await paymentService.generateToken()
      res.send(response)
    } catch(err) {
      return next(err)
    }
  }

  const processPayment = async (req, res, next) => {
    try {
      const { paymentMethodNonce, amount } = req.body
      const saleResult = await paymentService.processPayment({ paymentMethodNonce, amount })
      return res.json(saleResult)
    } catch(err) {
      return next(err)
    }
  }

  return {
    generateToken,
    processPayment
  }
}

export default paymentController