import { createContext, useState, useEffect, useMemo, useContext } from 'react'

export const AuthContext = createContext()

/*
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
*/

const AuthContextProvider = (props) => {
  const [userInAuthContext, setUserInAuthContext] = useState(null)

  const updateUserInAuthContext = (user) => {
    setUserInAuthContext(user)
  }

  return (
    <AuthContext.Provider value={{ userInAuthContext, updateUserInAuthContext }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider

/*

// const AuthContext = createContext()

export function useAuthContext() {
  const context = useContext(AuthContext)
  if(!context) {
    throw new Error('useAuthContext must be used within an AuthContextProvider')
  }

  return context
}

export const AuthContextProvider = (props) => {
  //const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInAuthContext, setUserInAuthContext] = useState(null)

  const value = useMemo(() => {
    function updateUserInAuthContext(userInAuthContext) {
      setUserInAuthContext(userInAuthContext)
    }

    return [ userInAuthContext, updateUserInAuthContext ]
    // return { userInAuthContext, updateUserInAuthContext }
  }, [ userInAuthContext ])

  return <AuthContext.Provider value={value} {...props} />
}
*/

