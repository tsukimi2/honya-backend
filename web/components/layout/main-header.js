import { useContext, useState, useEffect } from "react"
import { useRouter } from "next/router"
import styles from './main-header.module.css'
import { AuthContext } from "../../contexts/AuthContext"
import { localStorage_get } from "../../libs/utils/localStorage-utils"

const MainHeader = () => {
  const router = useRouter()
  let { user } = useContext(AuthContext)
  let storedUser = null
  let [username, setUsername] = useState('')

  useEffect(() => {
    if(!user) {
      user = localStorage_get('user')
    }

    if(user) {
      setUsername(user.username)
    }
  })

  if(user) {
    username = user.username
  }
  const pageToTitleDescriptionMapping = {
    '/': {
      title: 'Home',
      description: 'Honya App'
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
    '/admin/dashboard': {
      title: 'Admin Dashboard',
      description: `Konnichiwa, ${username}`,
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