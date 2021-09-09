import Accordion from 'react-bootstrap/Accordion'
import moment from 'moment'
import ProductList from '../product/ProductList'


const OrderItem = ({ oIndex, order }) => {
  return (
    <Accordion.Item eventKey={oIndex}>
      <Accordion.Header>Order ID: {order._id}</Accordion.Header>
      <Accordion.Body>
        Status: {order.status}<br />
        TransactionID: {order.transaction_id}<br />
        Amount: ${order.amount}<br />
        Ordered by: {order.user.name}<br />
        Ordered On: {moment(order.createdAt).fromNow()}<br />
        Delivery Address: {order.address}
        <h4 className="mt-4 mb-4">Total products in order: {order.products.length}</h4>

        <ProductList
          products={order.products}
        />
      </Accordion.Body>
    </Accordion.Item>
  )
}

export default OrderItem