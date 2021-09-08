import useSWR from "swr"
import { API_PREFIX, API_PROTO, API_HOST } from "../../config"


export const useBraintreeClientToken = ({ fullUrl=false }) => {
  const tmpUrl = `${API_PREFIX}/payment/braintree/getToken`
  const url = !fullUrl ? tmpUrl : `${API_PROTO}://${API_HOST}${tmpUrl}`

  const{ data, error } = useSWR(url)

  let err = undefined
  if(error) {
    err = error
  } else if(data && data.err) {
    err = true
  }

  return {
    braintreeClientToken: data,
    isLoading: !err && !data,
    isError: err
  }
}

export const processPayment = async ({ paymentData, fullUrl=false}) => {
  const tmpUrl = `${API_PREFIX}/payment/braintree`
  const url = !fullUrl ? tmpUrl : `${API_PROTO}://${API_HOST}${tmpUrl}`

  let data = null
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData)
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
