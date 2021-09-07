import CartPageComponent from '../components/page/CartPageComponent'
import { getCart } from "../libs/utils/cartHelpers"

const CartPage = () => {
  const items = getCart()

  return (
    <CartPageComponent
      cartItems={items}
    />
  )
}
 
export default CartPage;