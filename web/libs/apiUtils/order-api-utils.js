import useSWR from "swr"
import { API_PREFIX, API_PROTO, API_HOST } from "../../config"

export const createOrder = async ({ createOrderData, fullUrl=false }) => {
  const tmpUrl = `${API_PREFIX}/order`
  const url = !fullUrl ? tmpUrl : `${API_PROTO}://${API_HOST}${tmpUrl}`

  let data = null
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order: createOrderData })
    })
    data = await response.json()

    if (!response.ok) {
      throw new Error(data.errmsg)
    }
  } catch(err) {
    throw new Error(err)
  }

  return data
}

export const useOrders = ({ fullUrl=false }) => {
  const tmpUrl = `${API_PREFIX}/orders`
  const url = !fullUrl ? tmpUrl : `${API_PROTO}://${API_HOST}${tmpUrl}`

  const{ data, error } = useSWR(url)

  return {
    orders: data && data.orders ? data.orders : [],
    err: error && data ? data : null,
    isLoading: !error && !data,
    isError: error
  }
}

export const useOrderStatusValues = ({ fullUrl=false }) => {
  const tmpUrl = `${API_PREFIX}/orders/status-values`
  const url = !fullUrl ? tmpUrl : `${API_PROTO}://${API_HOST}${tmpUrl}`

  const{ data, error } = useSWR(url)

  return {
    statusValues: data && data.statusValues ? data.statusValues : [],
    err: error && data ? data : null,
    isLoading: !error && !data,
    isError: error
  }
}

export const useUserOrderHistory = ({ uid, fullUrl=false }) =>{
  const tmpUrl = `${API_PREFIX}/orders/user/${uid}`
  const url = !fullUrl ? tmpUrl : `${API_PROTO}://${API_HOST}${tmpUrl}`

  const{ data, error } = useSWR(url)

  return {
    orderHistory: data && data.orderHistory ? data.orderHistory : [],
    err: error && data ? data : null,
    isLoading: !error && !data,
    isError: error
  }
}

export const updateOrderStatus = async ({ orderId, status, fullUrl=false }) => {
  const tmpUrl = `${API_PREFIX}/orders/${orderId}/status`
  const url = !fullUrl ? tmpUrl : `${API_PROTO}://${API_HOST}${tmpUrl}`

  let data = null
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status })
    })
    data = await response.json()

    if (!response.ok) {
      throw new Error(data.errmsg)
    }
  } catch(err) {
    throw new Error(err)
  }

  return data && data.order ? data.order : null
}
