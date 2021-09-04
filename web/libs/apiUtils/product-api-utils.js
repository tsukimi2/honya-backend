import useSWR from 'swr'
import queryString from "query-string"
import { API_PREFIX } from '../../config'

export const createProduct = async (product) => {
  let data = null

  try {
    const response = await fetch(`${API_PREFIX}/product`, {
      method: 'POST',
      headers: {
        Accept: 'multipart/form-data',
        // Accept: 'application/json',
      },
      body: product
    })
    data = await response.json()

    if (!response.ok) {
      throw new Error(data.errmsg)
    }
  } catch(err) {
    throw new Error(err)
  }

  return data.data
}

/*
// export const useProducts = (sortBy, order='asc', limit=10) => {
export const useProducts = ({ sortBy, order='asc', limit=10 }) => {

  const { data, error } = useSWR(`${API_PREFIX}/products?sortBy=${sortBy}&order=${order}&limit=${limit}`)

  return {
    products: data && data.data && data.data.products ? data.data.products : null,
    isLoading: !error && !data,
    isError: error
  }
}
*/

export const useProduct = ({ fullUrl=false, id }) => {
  const { data, error } = useSWR(`${API_PREFIX}/products/${id}`)

  return {
    product: data && data.data && data.data.product ? data.data.product : null,
    isLoading: !error && !data,
    isError: error
  }}

// https://github.com/vercel/swr/issues/254
export const useProducts = (params) => { 
  const query = queryString.stringify(params)
  const { data, error } = useSWR(`${API_PREFIX}/products?${query}`)

  return {
    products: data && data.data && data.data.products ? data.data.products : null,
    isLoading: !error && !data,
    isError: error
  }
}

export const getProducts = async (params) => {
  const query = queryString.stringify(params)
  const fullUrl = params.fullUrl ? params.fullUrl : false
  const url = !fullUrl ? `${API_PREFIX}/products?${query}` : `${API_PROTO}://${API_HOST}${url}`

  try {
    const response = await fetch(url)
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.errmsg)
    }
  
    return data && data.data && data.data.products ? data.data.products : []
  } catch(err) {
    return []
  }
}

export const getFilteredProducts = async ({ skip, order, limit, filters={}}) => {
  let postData = {
    filters
  }
  if(skip) {
    postData['skip'] = skip
  }
  if(order) {
    postData['order'] = order
  }
  if(limit) {
    postData['limit'] = limit
  }

  let data = null

  try {
    const response = await fetch(`${API_PREFIX}/products/search`, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    })
    data = await response.json()

    if (!response.ok) {
      throw new Error(data.errmsg)
    }
  } catch(err) {
    throw new Error(err)
  }

  return data.data
}

export const useRelatedProducts = (productId) => {
  const { data, error } = useSWR(`${API_PREFIX}/products/${productId}/related?limit=3`)

  return {
    products: data && data.data && data.data.products ? data.data.products : [],
    isLoading: !error && !data,
    isError: error
  }
}
