import { useEffect, useState, useContext } from "react"
import { useRouter } from 'next/router'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { AuthContext } from "../../contexts/AuthContext"
import UserInfo from './UserInfo'
import PurchaseHistory from './PurchaseHistory'
import UserLinks from "./UserLlinks"
import { useUserOrderHistory } from "../../libs/apiUtils/order-api-utils"

const UserDashboard = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [uid, setUid] = useState('')

  const { userInAuthContext } = useContext(AuthContext)
  const { orderHistory: history } = useUserOrderHistory({ uid })
  const router = useRouter()

  useEffect(() => {   
    if(!userInAuthContext) {
      router.replace('/signin')
    } else {
      if(userInAuthContext.role === 'admin') {
        router.replace('/admin/dashboard')
      }

      setUsername(userInAuthContext.username)
      setEmail(userInAuthContext.email)
      setRole(userInAuthContext.role)
      setUid(userInAuthContext._id)
    }
  }, [userInAuthContext, router])

  return (
    <Container md={{ span: 8, offset: 2 }} className="mt-4">
      <Row>
        <Col md={3}><UserLinks uid={uid} /></Col>
        <Col md={9}>
          <UserInfo username={username} email={email} role={role} />
          <PurchaseHistory
            history={history}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default UserDashboard
