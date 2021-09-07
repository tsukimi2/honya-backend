import { useContext, useState, useEffect } from "react"
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import DropIn from 'braintree-web-drop-in-react'
import { AuthContext } from "../../contexts/AuthContext"
import { useBraintreeClientToken } from "../../libs/apiUtils/payment-api-utils"
import ShowAlert from "../ui/ShowAlert"


const Checkout = ({ products }) => {
  const { userInAuthContext } =  useContext(AuthContext)
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: '',
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
        setData({ ...data, error: `${braintreeClientToken.errmsg}. Please sign in before checkout` })
      } else {
        setData({ ...data, error: 'Error occurred during payment' })
      }
    }
  }, [isBraintreeClientTokenError])

console.log('data')
console.log(data)

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
    }


  }

  const showDropIn = () => (
    <>
      {
        data.clientToken && products.length > 0 && (
          <div onBlur={() => setData({ ...data, error: null })}>
            <DropIn
              options={{
                authorization: data.clientToken
              }} onInstance={instance => (data.instance = instance)}
            />
            <Button variant="success" onClick={buy} >Pay</Button>
          </div>
        )
      }
    </>
  )

  const showCheckout = () => (
    <>
      {
        userInAuthContext ? (
          <>{ showDropIn() }</>
        ) : (
          <Link href="/signin" passHref>
            <Button variant="primary">Sign in to checkout</Button>
          </Link>
        )
      }
    </>
  )

  return (
    <>
      <h2>Total: ${getTotal()}</h2>
      {
        data.error && (
          <ShowAlert>{data.error}</ShowAlert>
        )
      }
      { showCheckout() }
    </>
  )
}
 
export default Checkout;