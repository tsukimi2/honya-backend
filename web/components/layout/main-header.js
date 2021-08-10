import { useRouter } from "next/router"
import styles from './main-header.module.css'

const MainHeader = () => {
  const router = useRouter()
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