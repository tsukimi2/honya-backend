import { useContext, useEffect, useState } from "react"
import { useRouter } from 'next/router'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { localStorage_get } from '../../libs/utils/localStorage-utils'
import { AuthContext } from "../../contexts/AuthContext"
import UserInfo from './UserInfo'
import PurchaseHistory from './PurchaseHistory'
import UserLinks from "./UserLlinks"
import { isAuthenticated } from '../../libs/utils/auth-utils'

const UserDashboard = () => {
  let [username, setUsername] = useState('')
  let [email, setEmail] = useState('')
  let [role, setRole] = useState('')

  let { user } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if(!isAuthenticated()) {
      router.replace('/signin')
    }

    let storedUser = null
    if(!user) {
      storedUser = localStorage_get('user')
    } else {
      storedUser = { ...user }
    }

    if(storedUser) {
      if(storedUser.role === 'admin') {
        router.replace('/admin/dashboard')
      }

      setUsername(storedUser.username)
      setEmail(storedUser.email)
      setRole(storedUser.role)
    }
  }, [user, router])

  /*
      <Container md={{ span: 8, offset: 2 }}>
      <Row>
        <Col md={3}><AdminLinks /></Col>
        <Col md={9}><UserInfo username={username} email={email} role={role} /></Col>
      </Row>
    </Container>
    */

  return (
    <Container md={{ span: 8, offset: 2 }}>
      <Row>
        <Col md={3}><UserLinks /></Col>
        <Col md={9}>
          <UserInfo username={username} email={email} role={role} />
          <PurchaseHistory />
        </Col>
      </Row>
    </Container>
  )
}

/*
    <div className="container-fluid">
      <div className="row">
        <div className="col-3">
          <UserLinks />
        </div>
        <div className="col-9">
          <UserInfo username={username} email={email} role={role} />
          <PurchaseHistory />
        </div>
      </div>
    </div>
    */

export default UserDashboard
