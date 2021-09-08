import { useContext, useState, useEffect } from "react"
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import DropIn from 'braintree-web-drop-in-react'
import { AuthContext } from "../../contexts/AuthContext"
import { useBraintreeClientToken, processPayment } from "../../libs/apiUtils/payment-api-utils"
import ShowAlert from "../ui/ShowAlert"


const Checkout = ({ products }) => {
  const { userInAuthContext } =  useContext(AuthContext)
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: null,
    instance: {},
    address: ''
  })
  const { braintreeClientToken, isLoading, isError:isBraintreeClientTokenError } = useBraintreeClientToken({})

  useEffect(() => {
    if(braintreeClientToken && braintreeClientToken.clientToken) {
      setData({ ...data, clientToken: braintreeClientToken.clientToken})
    }
  }, [braintreeClientToken])

  useEffect(() => {
    if(isBraintreeClientTokenError) {
      if(braintreeClientToken.err) {
        setData({ ...data, error: `${braintreeClientToken.errmsg}` })
      } else {
        setData({ ...data, error: 'Error occurred during payment' })
      }
    }
  }, [isBraintreeClientTokenError])

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  }

  const buy = async () => {
    // send the nonce to your server
    // nonce = data.instance.requestPaymentMethod()
    let nonce = null
    try {
      const paymentMethodObj = await data.instance.requestPaymentMethod()

      nonce = paymentMethodObj.nonce
    } catch(err) {
      setData({ ...data, error: err.message })
      return
    }

    try {
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getTotal(products)
      }

      const paymentResponse = await processPayment({ paymentData })
console.log('paymentResponse')      
console.log(paymentResponse)
      setData({ ...data, success: paymentResponse.success })
    } catch(err) {
      setData({ ...data, error: err.message })
    }
  }

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: null })}>
      {
        data.clientToken && products.length > 0 ? (
          <>
            <DropIn
              options={{
                authorization: data.clientToken
              }} onInstance={instance => (data.instance = instance)}
            />
            <Button variant="success" size="lg" className="btn-block mt-3" onClick={buy} >Pay</Button>
          </>
        ) : ( showBtnCheckout() )
      }
    </div>
  )

  const showCheckout = () => (
    <>
      {
        userInAuthContext ? (
          <>{ showDropIn() }</>
        ) : ( showBtnCheckout() )
      }
    </>
  )

  const showBtnCheckout = () => (
    <Link href="/signin" passHref>
      <Button variant="primary">Sign in to checkout</Button>
    </Link>
  )

  return (
    <>
      <h2>Total: ${getTotal()}</h2>
      {
        data && data.error && data.error !== 'Forbidden access' && (
          <ShowAlert>{data.error}</ShowAlert>
        )
      }
      {
        data && data.success && (
          <ShowAlert alertLevel="success">Thank you! Your payment was successful!</ShowAlert>
        )
      }
      { showCheckout() }
    </>
  )
}
 
export default Checkout;