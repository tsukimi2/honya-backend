import PropTypes from 'prop-types'
import HorizontalProductCard from "./HorizontalProductCard"

const CartProductCard = ({ id, name, price, quantity, storedCount, handleCountChange, handleRemoveProduct }) => {
  const showAddToCardBtn = false
  const showCartUpdate = true

  return (
    <HorizontalProductCard
      id={id}
      name={name}
      price={price}
      quantity={quantity}
      count={storedCount}
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
}

export default CartProductCard