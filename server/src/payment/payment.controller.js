import braintree from 'braintree'

const paymentController = ({ config }) => {
  const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox, // comment out in production
    merchantId: config.get('security:payment:braintree:merchant_id'),
    publicKey: config.get('security:payment:braintree:public_key'),
    privateKey: config.get('security:payment:braintree:private_key'),
  })

  const generateToken = async (req, res) => {
    try {
      const response = await gateway.clientToken.generate({})
      // const clientToken = response.clientToken
      res.send(response)
    } catch(err) {
      res.status(500).send(err);
    }
  }

  return {
    generateToken
  }
}

export default paymentController