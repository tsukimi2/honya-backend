import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/router"
import styles from './main-header.module.css'
// import { useAuthContext } from "../../contexts/AuthContext"
import { AuthContext } from "../../contexts/AuthContext"
import { localStorage_get } from "../../libs/utils/localStorage-utils"

const MainHeader = () => {
  const router = useRouter()
  // const { user } = useContext(AuthContext)
  const { userInAuthContext } = useContext(AuthContext)
  // const [ userInAuthContext, updateUserInAuthContext ]= useAuthContext()
  // const { userInAuthContext } = useAuthContext()
  let [username, setUsername] = useState('')

  useEffect(() => {
    let storedUser = null
    if(!userInAuthContext) {
      storedUser = localStorage_get('user')
    } else {
      storedUser = { ...userInAuthContext }
    }

    if(storedUser) {
      setUsername(storedUser.username)
    }
  }, [userInAuthContext])

  const pageToTitleDescriptionMapping = {
    '/': {
      title: 'Home',
      description: 'Honya App'
    },
    '/admin/category': {
      title: 'Category',
      description: `Konnichiwa, ${username}`,
    },
    '/admin/dashboard': {
      title: 'Admin Dashboard',
      description: `Konnichiwa, ${username}`,
    },
    '/admin/orders': {
      title: 'Orders',
      description: `Konnichiwa, ${username}, you can manage all the orders here`,
    },
    '/admin/product/create': {
      title: 'Add a new product',
      description: `Konnichiwa, ${username}, ready to add a new product?`
    },
    '/shop': {
      title: 'Shop',
      description: 'Shop and find books you like'
    },
    '/cart': {
      title: 'Shopping Cart',
      description: 'Manage your cart items. Add remove checkout or continue shopping.'
    },
    '/signup': {
      title: 'Sign Up',
      description: 'Honya App'
    },
    '/signin': {
      title: 'Sign In',
      description: 'Honya App'
    },
    '/user/dashboard': {
      title: 'Dashboard',
      description: `Konnichiwa, ${username}`,
    },
    '/product': {
      title: 'Product',
      description: ''
    }
  }

  const getTitle = (currPath) => !pageToTitleDescriptionMapping[currPath] ? null : pageToTitleDescriptionMapping[currPath].title
  const getDescription = (currPath) => !pageToTitleDescriptionMapping[currPath] ? null : pageToTitleDescriptionMapping[currPath].description

  return (
    <div>
      <div className={styles.jumbotron}>
        <h2>{getTitle(router.asPath)}</h2>
        <p className="lead">{getDescription(router.asPath)}</p>
      </div>
    </div>
  )
}

export default MainHeader