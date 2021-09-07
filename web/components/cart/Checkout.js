import { useContext } from "react"
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import { AuthContext } from "../../contexts/AuthContext"




const Checkout = ({ products }) => {
  const { userInAuthContext } =  useContext(AuthContext)

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  }

  return (
    <>
      <h2>Total: ${getTotal()}</h2>
      {
        userInAuthContext ? (
          <Button variant="success">Checkout</Button>
        ) : (
          <Link href="/signin" passHref>
            <Button variant="primary">Sign in to checkout</Button>
          </Link>
        )
      }
    </>
  )
}
 
export default Checkout;