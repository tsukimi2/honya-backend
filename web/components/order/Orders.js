import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import LoadingOverlay from "../ui/LoadingOverlay"
import ShowAlert from "../ui/ShowAlert"
import OrderList from './OrderList'


const Orders = ({ orders, isLoading, isError, errOrders, statusValues, handleStatusChange }) => {
  return (
    <Container md={{ span: 8, offset: 2 }} className="mt-4">
      {
        isLoading && (
          <LoadingOverlay />
        )
      }
      {
        orders && Array.isArray(orders) && orders.length === 0 && (
          <ShowAlert alertLevel="info">No orders found</ShowAlert>
        )
      }
      {
        isError && errOrders && (
          <ShowAlert>{errOrders.errmsg}</ShowAlert>
        )
      }
      {
        orders && Array.isArray(orders) && orders.length !== 0 && (
          <Row>
            <h1>Total orders: {orders.length}</h1>
            <OrderList
              orders={orders}
              statusValues={statusValues}
              handleStatusChange={handleStatusChange}
            />
          </Row>
        )
      }
    </Container>
  )
}

export default Orders