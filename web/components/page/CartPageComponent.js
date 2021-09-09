import { useState, useContext } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CartProductCard from '../product/CartProductCard'
import Checkout from '../cart/Checkout'
import { emptyCart, updateItemInCart, getNumItemsInCart, removeItemInCart } from '../../libs/utils/cartHelpers'
import { CartContext } from '../../contexts/CartContextProvider'


const CartPageComponent = ({ cartItems }) => {
  const { dispatch:cartDispatch } = useContext(CartContext)
  const [items, setItems] = useState(cartItems)
  //const [count, setCount] = useState(storedCount)

  const removeItem = (id) => {
    setItems(items.filter(elem => elem._id !== id))
  }

  const handleEmptyCart = () => {
    emptyCart()
    cartDispatch({type: 'SET_ITEMS_COUNT', count: 0 })
    setItems([])
  }

  const handleCountChange = (productId, val) => {
    // setCount(val < 1 ? 1 : val)
    const count = val < 1 ? 1 : val
    setItems(items.map(elem => {
      if(elem._id === productId) {
        return { ...elem, count: val }
      }
      return elem
    }))
    updateItemInCart(productId, val)
    cartDispatch({ type: 'SET_ITEMS_COUNT', count: getNumItemsInCart() })
  }

  const handleRemoveProduct = (productId) => {
    removeItemInCart(productId)
    cartDispatch({ type: 'SET_ITEMS_COUNT', count: getNumItemsInCart() })
    removeItem(productId)
  }

console.log('items')
console.log(items)
  return (
    <Container fluid>
      <Row>
        <Col md={6}>
        {
          items.map((product, idx) => (
            <CartProductCard
              key={idx}
              id={product._id}
              name={product.name}
              description={product.description}
              price={product.price}
              category={product.category}
              createdAt={product.createdAt}
              quantity={product.quantity}
              storedCount={product.count}
              showAddToCardBtn={false}
              handleRemoveProduct={handleRemoveProduct}
              handleCountChange={handleCountChange}
            />
          ))
        }
        {
          items.length === 0 && (<h2>Your cart is empty.</h2>)
        }
        </Col>
        <Col md={6}>
          <h2 className="mb-4">Your cart summary</h2>
          <hr />
          <Checkout
            products={items}
            handleEmptyCart={handleEmptyCart}
          />
        </Col>
      </Row>
    </Container>
  )
}
 
export default CartPageComponent;