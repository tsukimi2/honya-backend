import Spinner from 'react-bootstrap/Spinner'
import styles from './LoadingOverlay.module.css'

const LoadingOverlay = () => {
  return(
    <div className={styles.overlay}>
      <Spinner animation="border" className={styles.spinner} />
    </div>
  )
}

export default LoadingOverlay