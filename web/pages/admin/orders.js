import WithAuth from '../../components/auth/WithAuth'
import WithAdmin from '../../components/auth/WithAdmin'
import Orders from '../../components/order/Orders'
import { useOrders } from '../../libs/apiUtils/order-api-utils'


const OrdersPage = () => {
  const { orders, err:errOrders, isLoading, isError } = useOrders({})
console.log('orders')
console.log(orders)
  return (
    <>
      <Orders
        orders={orders}
        isLoading={isLoading}
        isError={isError}
        errOrders={errOrders}
      />
    </>
  )
}

export default WithAuth(WithAdmin(OrdersPage))