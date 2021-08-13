import { createContext, useState } from 'react'

export const AuthContext = createContext()

const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  const setIsAuth = (isAuthFlag) => {
    setIsAuthenticated(isAuthFlag)
  }
  const setUserInAuthContext = (user) => {
    setUser(user)
  }
  const clearAuthContext = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuth, user, setUserInAuthContext, clearAuthContext }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
