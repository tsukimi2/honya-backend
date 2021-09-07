import useSWR from "swr"
import { API_PREFIX, API_PROTO, API_HOST } from "../../config"


export const useBraintreeClientToken = ({ fullUrl=false }) => {
  // const fullUrl = params.fullUrl ? params.fullUrl : false
  const tmpUrl = `${API_PREFIX}/payment/getToken`
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
