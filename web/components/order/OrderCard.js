import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

const OrderCard = ({ order }) => {
  return (
    <Card className="mb-4">
      <Card.Title>
        <Card.Text>Order ID: {order._id}</Card.Text>
        Status: {order.status}<br />
        Order Placed: {order.createdAt}<br />
        Total: {order.amount}
      </Card.Title>
      <Card.Body>
        <ListGroup>
        {
          order.products.map((product, idx) => (
            <ListGroup.Item key={idx}>{product.name}</ListGroup.Item>
          ))
        }
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

OrderCard.propTypes = {
  order: PropTypes.object.isRequired,
}
 
export default OrderCard