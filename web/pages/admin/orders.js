import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import WithAuth from '../../components/auth/WithAuth'
import WithAdmin from '../../components/auth/WithAdmin'
import Orders from '../../components/order/Orders'
import { useOrders, useOrderStatusValues, updateOrderStatus } from '../../libs/apiUtils/order-api-utils'


const OrdersPage = () => {
  const { orders, err:errOrders, isLoading, isError } = useOrders({})
  const { statusValues } = useOrderStatusValues({})
  const [orderList, setOrderList] = useState([])

  useEffect(() => {
    setOrderList([...orders])
  }, [orders])

  const handleStatusChange = async (orderId, status, oldStatus) => { 
    try {
      await updateOrderStatus({ orderId, status })
      setOrderList(orderList.map(order => {
        if(order._id === orderId) {
          return { ...order, status }
        }
        return order
      }))
      toast.success('Order status update successful', {
        toastId: 'orderStatusUpdateSucessToastId',
      })
    } catch(err) {
      setOrderList(orderList.map(order => {
        if(order._id === orderId) {
          return { ...order, status: oldStatus }
        }
        return order
      }))
      toast.error('Order status update failed', {
        toastId: 'orderStatusUpdateFailedToastId',
      })
    }
  }

  return (
    <>
      <Orders
        orders={orderList}
        isLoading={isLoading}
        isError={isError}
        errOrders={errOrders}
        statusValues={statusValues}
        handleStatusChange={handleStatusChange}
      />
      <ToastContainer
        position="bottom-center"
        autoClose={5}
        limit={1}
        hideProgressBar
        draggable={false}
      />
    </>
  )
}

export default WithAuth(WithAdmin(OrdersPage))