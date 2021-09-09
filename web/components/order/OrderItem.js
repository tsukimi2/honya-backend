import Form from 'react-bootstrap/Form'
import Accordion from 'react-bootstrap/Accordion'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import moment from 'moment'
import ProductList from '../product/ProductList'


const OrderItem = ({ oIndex, order, statusValues, handleStatusChange }) => {
  const onStatusChange = (e, oldStatus, orderId) => {
    const status = e.target.value
    handleStatusChange(orderId, status, oldStatus)
  }

  return (
    <Accordion.Item eventKey={oIndex}>
      <Accordion.Header>Order ID: {order._id}</Accordion.Header>
      <Accordion.Body>
        <Form.Group className="mb-3" controlId="order-status">
          <FloatingLabel label="Order Status">
            <Form.Control as="select"
              aria-label="Order Status"
              onChange={e => onStatusChange(e, order.status, order._id)}
            >
              {
                statusValues.map((status, index) => {
                  if(status === order.status) {
                    return (<option key={index} value={status} selected>{status}</option>)
                  }
                  return (<option key={index} value={status}>{status}</option>)
                })
              }
            </Form.Control>
          </FloatingLabel>
        </Form.Group>
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