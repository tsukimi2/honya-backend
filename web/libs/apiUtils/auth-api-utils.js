export const register = async (username, password, email) => {
  const response = await fetch('/api/v1/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, email }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.errmsg);
  }

  return data;
}