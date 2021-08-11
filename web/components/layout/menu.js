import Link from 'next/link'
import { useRouter } from 'next/router'
import { signout, isAuthenticated } from '../../libs/apiUtils/auth-api-utils'

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

        <li className="nav-item">
          <Link href="/signup">
            <a
              className="nav-link"
              style={isActive(router.asPath, '/signout')}
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
                className="nav-link"
                style={{ cursor: "pointer", color: "#ffffff" }}
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


/*
function ActiveLink({ children, href }) {
  const router = useRouter()
  const style = {
    marginRight: 10,
    color: router.asPath === href ? 'red' : 'black',
  }

  const handleClick = (e) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  )
}

export default ActiveLink
*/
