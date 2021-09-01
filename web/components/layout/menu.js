import { useContext, useEffect, useState } from 'react'
import cookie from 'cookie-cutter'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signout } from '../../libs/apiUtils/auth-api-utils'
import { localStorage_get } from '../../libs/utils/localStorage-utils'
import styles from './menu.module.css'
import { AuthContext } from '../../contexts/AuthContext'
import { Nav } from 'react-bootstrap'

const isActive = (routerPath, href) => {
  if(routerPath === href) {
    return { color: '#ff9900' }
  } else {
    return { color: '#ffffff' }
  }
}

const Menu = () => {
  const router = useRouter()
  const { userInAuthContext, updateUserInAuthContext } = useContext(AuthContext)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const hasLoginHash = cookie.get('loginHash') ? true : false
    setIsAuthenticated(hasLoginHash)
  }) 
  /* eslint-enable react-hooks/exhaustive-deps */


  const signoutHandler = () => {  
    signout()
    updateUserInAuthContext(null)
    setIsAuthenticated(false)
    router.push('/')
  }

  const getUserRole = () => {
    let user = null

    if(userInAuthContext) {
      user = {...userInAuthContext}
    } else {
      user = localStorage_get('user')
    }
    if(!user || (user && !user.role)) {
      return null
    }

    return user.role
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
          {isAuthenticated && getUserRole() === 'user' && (
            <Link href="/user/dashboard">
             <a
                className="nav-link"
                style={isActive(router.asPath, '/user/dashboard')}
              >
                Dashboard
              </a>
            </Link>
          )}

          {isAuthenticated && getUserRole() === 'admin' && (
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
            !isAuthenticated && (
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
            isAuthenticated && (
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
