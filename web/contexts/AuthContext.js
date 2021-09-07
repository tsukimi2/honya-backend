import { createContext, useState, useEffect, useMemo, useContext } from 'react'

export const AuthContext = createContext()

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
