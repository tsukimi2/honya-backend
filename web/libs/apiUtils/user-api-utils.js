import useSWR from "swr"
import { API_PREFIX, API_HOST, API_PROTO } from "../../config"

export const useUser = ({ uid, fullUrl=false }) => {
  const tmpUrl = `${API_PREFIX}/users/${uid}`
  const url = !fullUrl ? tmpUrl : `${API_PROTO}://${API_HOST}${tmpUrl}`

  const{ data, error } = useSWR(url)

  return {
    user: data && data.data && data.data.user ? data.data.user : null,
    err: error && data ? data : null,
    isLoading: !error && !data,
    isError: error
  }
}

export const updateUser = async ({ user, fullUrl=false }) => {
  const tmpUrl = `${API_PREFIX}/users/${user._id}`
  const url = !fullUrl ? tmpUrl : `${API_PROTO}://${API_HOST}${tmpUrl}`

  let data = null
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    })
      
    data = await response.json()

    if (!response.ok) {
      throw new Error(data.errmsg)
    }
  } catch(err) {
    throw new Error(err)
  }

  return data && data.data && data.data.user ? data.data.user : null
}
