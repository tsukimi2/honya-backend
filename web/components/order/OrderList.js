import Accordion from 'react-bootstrap/Accordion'
import OrderItem from './OrderItem'

const OrderList = ({ orders }) => {
  return (
    <Accordion>
    {
      orders.map((order, oIndex) => {
        return (
          <OrderItem
            oIndex={oIndex}
            key={oIndex}
            order={order}
          />
        )
      })
    }
    </Accordion>
  )
}

export default OrderList