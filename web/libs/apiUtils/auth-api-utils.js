import { API } from '../../config'

export const signup = async (username, password, email) => {
  const response = await fetch(`${API}/register`, {
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
  const response = await fetch(`${API}/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.errmsg)
  }

  return data
}

export const signout = async () => {
  fetch(`${API}/logout`)
  try {
    localStorage.clear()
  } catch(e) {

  }
}
