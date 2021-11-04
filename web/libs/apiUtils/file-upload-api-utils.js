import useSWR from 'swr'
import http from './http-common'
import { API_PREFIX } from '../../config'

export const getFile = (productId) => {
  return http.get(`/products/${productId}/photo`)
}

export const useProductImage = ({ fullUrl=false, productId }) => {  
  const { data, error } = useSWR(`${API_PREFIX}/products/${productId}/photo`)
console.log('data')
console.log(data)
  return {
    image: data ? data : null,
    isLoading: !error && !data,
    isError: error
  }
}