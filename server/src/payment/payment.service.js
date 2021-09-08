import braintree from 'braintree'

//
const productService = ({ config }) => {
  const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox, // comment out in production
    merchantId: config.get('security:payment:braintree:merchant_id'),
    publicKey: config.get('security:payment:braintree:public_key'),
    privateKey: config.get('security:payment:braintree:private_key'),
  })

  const generateToken = () => {
    return gateway.clientToken.generate({})
  }

  const processPayment = ({ paymentMethodNonce, amount }) => {
    return gateway.transaction.sale({
      amount,
      paymentMethodNonce,
      options: {
        submitForSettlement: true
      }
    })
  }

  return {
    generateToken,
    processPayment,
  }
}

export default productService