import { useContext } from 'react'
import { useRouter } from "next/router"
import { AuthContext } from "../../contexts/AuthContext"
import { localStorage_get } from "../../libs/utils/localStorage-utils"

const WithAdmin = (WrappedComponent) => (props) => {
  // return (props) => {
    const { userInAuthContext } = useContext(AuthContext) // eslint-disable-line react-hooks/rules-of-hooks
    const Router = useRouter() // eslint-disable-line react-hooks/rules-of-hooks

    // check existence of user in AuthContext first
    if(userInAuthContext && userInAuthContext.role === 'admin') {
      return <WrappedComponent {...props} />
    }

    // then check local storage for user
    const storedUser = localStorage_get('user')

    if(storedUser && storedUser.role === 'admin') {
      //updateUserInAuthContext(storedUser)
      return <WrappedComponent {...props} />
    }

    try {
      Router.replace('/user/dashboard')
    } catch(err) {
      // eslint-disable-line no-empty
    }

    return null
  // }
}

export default WithAdmin