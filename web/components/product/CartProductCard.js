import { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import HorizontalProductCard from "./HorizontalProductCard"
import { updateItemInCart, removeItemInCart, getNumItemsInCart } from '../../libs/utils/cartHelpers'
import { CartContext } from '../../contexts/CartContextProvider'

const CartProductCard = ({ id, name, price, quantity, storedCount, removeItem }) => {
  const [count, setCount] = useState(storedCount)
  const { dispatch:cartDispatch } = useContext(CartContext)
  const showAddToCardBtn = false
  const showCartUpdate = true

  const handleCountChange = (productId, val) => {
    setCount(val < 1 ? 1 : val)
    if(val >= 1) {
      updateItemInCart(productId, val)
      cartDispatch({ type: 'SET_ITEMS_COUNT', count: getNumItemsInCart() })
    }
  }

  const handleRemoveProduct = (productId) => {
    removeItemInCart(productId)
    cartDispatch({ type: 'SET_ITEMS_COUNT', count: getNumItemsInCart() })
    removeItem(productId)
  }

  return (
    <HorizontalProductCard
      id={id}
      name={name}
      price={price}
      quantity={quantity}
      count={count}
      showAddToCardBtn={showAddToCardBtn}
      showCartUpdate={showCartUpdate}
      showRemoveProductBtn={true}
      handleCountChange={handleCountChange}
      handleRemoveProduct={handleRemoveProduct}
    />
  )
}

CartProductCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  storedCount: PropTypes.number.isRequired,
}

export default CartProductCard