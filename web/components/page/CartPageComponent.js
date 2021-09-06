import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CartProductCard from '../product/CartProductCard'
import Checkout from '../cart/Checkout'

const CartPageComponent = ({ cartItems }) => {
  const [items, setItems] = useState(cartItems)

  const removeItem = (id) => {
    setItems(items.filter(elem => elem._id !== id))
  }

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
              removeItem={removeItem}
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
          <Checkout products={items} />
        </Col>
      </Row>
    </Container>
  )
}
 
export default CartPageComponent;