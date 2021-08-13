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

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuth, user, setUserInAuthContext }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider



/*import React, { Component, createContext } from 'react';

export const AuthContext = createContext();

class AuthContextProvider extends Component {
  state = {
    isAuthenticated: false
  }
  toggleAuth = () => {
    this.setState({ isAuthenticated: !this.state.isAuthenticated });
  }
  render() { 
    return (
      <AuthContext.Provider value={{...this.state, toggleAuth: this.toggleAuth}}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
 
export default AuthContextProvider;

*/