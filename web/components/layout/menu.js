import { useContext } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Link from 'next/link'
import Nav from 'react-bootstrap/Nav'
import Badge from 'react-bootstrap/Badge'
import { useRouter } from 'next/router'
import { signout } from '../../libs/apiUtils/auth-api-utils'
import styles from './menu.module.css'
import { AuthContext } from '../../contexts/AuthContext'
import { CartContext } from '../../contexts/CartContextProvider'


const isActive = (routerPath, href) => {
  if(routerPath === href) {
    return { color: '#ff9900' }
  } else {
    return { color: '#ffffff' }
  }
}

const Menu = () => {
  const router = useRouter()
  const { userInAuthContext, dispatch:authDispatch } = useContext(AuthContext)
  const { numItemsInCart } = useContext(CartContext)

  const signoutHandler = () => {  
    signout()
    authDispatch({ type: 'SET_USER', user: null })
    router.push('/')
  }

  return (
    <Navbar bg="primary" collapseOnSelect expand="lg" variant="dark">
      <Navbar.Brand>
        <Link href="/">
          <a
            className="nav-link"
            style={isActive(router.asPath, '/')}
          >
            Honya
          </a>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav sticky="top" className="me-auto">
          <Link href="/shop" passHref>
            <a
              className="nav-link"
              style={isActive(router.asPath, '/shop')}
            >
              Shop
            </a>
          </Link>
          <Link href="/cart" passHref>
            <a
              className="nav-link"
              style={isActive(router.asPath, '/cart')}
            >
              Cart { numItemsInCart > 0 && (<sup><Badge pill bg="info">{numItemsInCart}</Badge></sup>)}
            </a>
          </Link>
          {userInAuthContext && userInAuthContext.role === 'user' && (
            <Link href="/user/dashboard">
             <a
                className="nav-link"
                style={isActive(router.asPath, '/user/dashboard')}
              >
                Dashboard
              </a>
            </Link>
          )}

          {userInAuthContext && userInAuthContext.role === 'admin' && (
            <Link href="/admin/dashboard" passHref>
              <a
                className="nav-link"
                style={isActive(router.asPath, '/admin/dashboard')}
              >
                Dashboard
              </a>
            </Link>
          )}

          <Link href="/signup" passHref>
            <a
              className="nav-link"
              style={isActive(router.asPath, '/signup')}
            >
              Sign Up
            </a>
          </Link>

          {
            !userInAuthContext && (
              <Link href="/signin" passHref>
                <a
                  className="nav-link"
                  style={isActive(router.asPath, '/signin')}
                >
                  Sign In
                </a>
              </Link>
            )
          }

          {
            userInAuthContext && (
              <Button
                className={styles.signoutBtn}
                variant="outline-light"
                onClick={signoutHandler}
              >
                Sign Out
              </Button>
            )
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Menu
