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