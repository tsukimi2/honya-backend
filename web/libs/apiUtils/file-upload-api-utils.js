import http from './http-common'

export const getFile = (productId) => {
  return http.get(`/products/${productId}/photo`)
}