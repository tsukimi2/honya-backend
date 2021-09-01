import useSWR from 'swr'
import { API_PREFIX } from '../../config'

export const createProduct = async (product) => {
  let data = null

  try {
    const response = await fetch(`${API_PREFIX}/product`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
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

export const useProducts = (sortBy, order='asc', limit=10) => {
  const { data, error } = useSWR(`${API_PREFIX}/products?sortBy=${sortBy}&order=${order}&limit=${limit}`)

  return {
    products: data && data.data && data.data.products ? data.data.products : null,
    isLoading: !error && !data,
    isError: error
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
