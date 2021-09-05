export const localStorage_get = (key) => {
  if(typeof window === 'undefined') {
    return null
  }

  return JSON.parse(localStorage.getItem(key))
}

export const localStorage_set = (key, obj) => {
  if(typeof window === 'undefined') {
    return false
  }

  localStorage.setItem(key, JSON.stringify(obj))
  return true
}