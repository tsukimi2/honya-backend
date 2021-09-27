import { createContext, useState, useEffect, useReducer } from 'react'
import { localStorage_set, localStorage_get } from '../libs/utils/localStorage-utils'
import { authReducer } from './authDispatcher'

export const AuthContext = createContext()

/*
const AuthContextProvider = (props) => {
  const [userInAuthContext, setUserInAuthContext] = useState(null)

  const updateUserInAuthContext = (user) => {
    setUserInAuthContext(user)
  }

  useEffect(() => {
    localStorage_set('user', userInAuthContext)
  }, [userInAuthContext])

  return (
    <AuthContext.Provider value={{ userInAuthContext, updateUserInAuthContext }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
*/

const AuthContextProvider = (props) => {
  const [userInAuthContext, dispatch] = useReducer(authReducer, null, () => {
    const user = localStorage_get('user')
    return user ? user : null
  })

  useEffect(() => {
    localStorage_set('user', userInAuthContext)
  }, [userInAuthContext])

  return (
    <AuthContext.Provider value={{ userInAuthContext, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
