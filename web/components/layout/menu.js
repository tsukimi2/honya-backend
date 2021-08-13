import Link from 'next/link'
import { useRouter } from 'next/router'
import { signout } from '../../libs/apiUtils/auth-api-utils'
import { isAuthenticated } from '../../libs/utils/auth-utils'
import { localStorage_get } from '../../libs/utils/localStorage-utils'
import styles from './menu.module.css'


const isActive = (routerPath, href) => {
  if(routerPath === href) {
    return { color: '#ff9900' }
  } else {
    return { color: '#ffffff' }
  }
}

const Menu = () => {
  const router = useRouter()

  const signoutHandler = () => {  
    signout()
    router.push('/')
  }

  const getUserRole = () => { 
    const user = localStorage_get('user')
    if(!user || (user && !user.role)) {
      return null
    }

    return user.role
  }

  return (
    <div>
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-item">
          <Link href="/">
            <a
              className="nav-link"
              style={isActive(router.asPath, '/')}>
                Home
            </a>
          </Link>
        </li>

        {isAuthenticated() && getUserRole() === 'user' && (
          <li className="nav-item">
            <Link href="/user/dashboard">
              <a
                className="nav-link"
                style={isActive(router.asPath, '/user/dashboard')}
              >
                Dashboard
              </a>
            </Link>
          </li>
        )}

        {isAuthenticated() && getUserRole() === 'admin' && (
          <li className="nav-item">
            <Link href="/admin/dashboard">
              <a
                className="nav-link"
                style={isActive(router.asPath, '/admin/dashboard')}
              >
                Dashboard
              </a>
            </Link>
          </li>
        )}

        <li className="nav-item">
          <Link href="/signup">
            <a
              className="nav-link"
              style={isActive(router.asPath, '/signup')}
            >
              Sign Up
            </a>
          </Link>
        </li>
        
        {
          !isAuthenticated() && (
            <li className="nav-item">
              <Link href="/signin">
                <a
                  className="nav-link"
                  style={isActive(router.asPath, '/signin')}
                >
                  Sign In
                </a>
              </Link>
            </li>
          )
        }

        {
          isAuthenticated() && (
            <li className="nav-item">
              <button
                className={styles.signoutBtn}
                className="nav-link"
                onClick={signoutHandler}
              >
                Sign Out
              </button>
            </li>
          )
        }
      </ul>
    </div>
  )
}

export default Menu
