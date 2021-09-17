import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import OrderList from '../order/OrderList'

const PurchaseHistory = ({ history }) => {
  
  return (
    <Card>
    <Card.Header>Purchase history</Card.Header>
    <Card.Body>
      <OrderList
        orders={history}
      />
    </Card.Body>
  </Card>
  )
}

PurchaseHistory.propTypes = {
  history: PropTypes.array.isRequired,
}

export default PurchaseHistory