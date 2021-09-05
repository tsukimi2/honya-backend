import { createContext, useReducer } from 'react'
import { cartReducer } from './cartDispatcher'
import { getNumItemsInCart } from '../libs/utils/cartHelpers'

export const CartContext = createContext()

const CartContextProvider = (props) => {
const [numItemsInCart, dispatch] = useReducer(cartReducer, 0, () => {
  const numItems = getNumItemsInCart('cart')
  return numItems ? numItems : 0
})

  return (
    <CartContext.Provider value={{ numItemsInCart, dispatch }}>
      {props.children}
    </CartContext.Provider>
  )
}

export default CartContextProvider

/*
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
*/