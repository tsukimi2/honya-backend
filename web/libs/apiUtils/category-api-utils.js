import 'whatwg-fetch'
import { API_PREFIX } from '../../config'

export const getCategories = async () => {
  const response = await fetch(`${API_PREFIX}/categories`)

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.errmsg)
  }

  return data
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
    console.log('err')
    console.log(err)
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
