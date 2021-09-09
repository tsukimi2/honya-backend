import Accordion from 'react-bootstrap/Accordion'
import OrderItem from './OrderItem'

const OrderList = ({ orders, statusValues, handleStatusChange }) => {
  return (
    <Accordion>
    {
      orders.map((order, oIndex) => {
        return (
          <OrderItem
            oIndex={oIndex}
            key={oIndex}
            order={order}
            statusValues={statusValues}
            handleStatusChange={handleStatusChange}
          />
        )
      })
    }
    </Accordion>
  )
}

export default OrderList