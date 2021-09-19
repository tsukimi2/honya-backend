import useSWR from 'swr'
import 'whatwg-fetch'
import { API_PROTO, API_HOST, API_PREFIX } from '../../config'

export const getCategories = async ({ fullUrl=false }) => {
  let url = `${API_PREFIX}/categories`
  if(fullUrl) {
    url = `${API_PROTO}://${API_HOST}${url}`
  }

  let response = null
  let data = null

  try {
    response = await fetch(url)

    data = await response.json()

  } catch(err) {
    throw new Error(err)
  }

  if (!response.ok) {
    throw new Error(data.errmsg)
  }

  return data
}

export function useCategories() {
  const { data, error } = useSWR(`${API_PREFIX}/categories`)

  return {
    categories: data && data.data && data.data.categories ? data.data.categories : [],
    isLoading: !error && !data,
    isError: error
  }
}

export const createCategory = async (category) => {
  let response = null
  try {
    response = await fetch(`${API_PREFIX}/category`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    })
  } catch(err) {

  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.errmsg)
  }

  return data.data
}

export const updateCategory = async (id, name) => {
  const response = await fetch(`${API_PREFIX}/categories/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name
    })
  })

  const data = await response.json()

  if(!response.ok) {
    throw new Error(data.errmsg)
  }

  return data.data
}

export const deleteCategory = async (id) => {
  const response = await fetch(`${API_PREFIX}/categories/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error(data.errmsg)
  }

  return response.ok
}
