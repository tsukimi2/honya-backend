import Menu from './menu'
import MainHeader from './main-header'
import styles from './Layout.module.css'

const Layout = ({ children }) => {
  return (
    <>
      <Menu />
      <MainHeader />
      <main className={styles.main}>{children}</main>
    </>
  )
}

export default Layout