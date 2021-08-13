import { Fragment } from 'react'
import Menu from './menu'
import MainHeader from './main-header'

const Layout = ({ children, className }) => {
  return (
    <Fragment>
      <Menu />
      <MainHeader />
      <main className={className}>{children}</main>
    </Fragment>
  )
}

export default Layout