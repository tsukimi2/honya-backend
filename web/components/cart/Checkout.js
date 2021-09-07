import { useContext, useState, useEffect } from "react"
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import DropIn from 'braintree-web-drop-in-react'
import { AuthContext } from "../../contexts/AuthContext"
import { useBraintreeClientToken } from "../../libs/apiUtils/payment-api-utils"


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
/*  
  console.log('braintreeClientToken')
  console.log(braintreeClientToken)
  console.log('isLoading')
  console.log(isLoading)
  console.log('isBraintreeClientTokenError')
  console.log(isBraintreeClientTokenError)
*/

  useEffect(() => {
    if(braintreeClientToken && braintreeClientToken.clientToken) {
      setData({ clientToken: braintreeClientToken.clientToken })
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

  const showDropIn = () => (
    <>
      {
        data.clientToken && products.length > 0 && (
          <>
            <DropIn
              options={{
                authorization: data.clientToken
              }} onInstance={instance => (data.instance = instance)}
            />
            <Button variant="success">Checkout</Button>
          </>
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
      { showCheckout() }
    </>
  )
}
 
export default Checkout;