import PropTypes from 'prop-types'
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

OrderList.propTypes = {
  orders: PropTypes.array.isRequired,
  statusValues: PropTypes.array,
  handleStatusChange: PropTypes.func,
}

OrderList.defaultProps = {
  statusValues: null,
  handleStatusChange: () => {}
}

export default OrderList