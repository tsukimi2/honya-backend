import 'whatwg-fetch'
import { API_PREFIX } from '../../config'

export const signup = async (username, password, email) => {
  const response = await fetch(`${API_PREFIX}/register`, {
    method: 'POST',
    body: JSON.stringify({ username, password, email }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.errmsg)
  }

  return data
}

export const signin = async (user) => {
  let response = null
  try {
    response = await fetch(`${API_PREFIX}/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
  } catch(err) {
    console.log('err')
    console.log(err)
  }

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.errmsg)
  }

  return data
}

export const signout = async () => {
  fetch(`${API_PREFIX}/logout`)
  try {
    localStorage.clear()
  } catch(e) {

  }
}
