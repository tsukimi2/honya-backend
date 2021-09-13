import { useEffect, useState, useContext } from "react"
import { useRouter } from 'next/router'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { AuthContext } from "../../contexts/AuthContext"
import UserInfo from "./UserInfo"
import AdminLinks from "./AdminLinks"


const AdminDashboard = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  // const [isAuthenticated, setIsAuthenticated] = useState(false)

  const { userInAuthContext } = useContext(AuthContext)
  const router = useRouter()

  /*
  useEffect(() => {
    const loginHash = cookie.get('loginHash')
    if(loginHash) {  
      setIsAuthenticated(true)        
    } else {
      setIsAuthenticated(false)
    }

    if(!loginHash) {
      router.replace('/signin')
    }

    let storedUser = null
    if(!userInAuthContext) {
      storedUser = localStorage_get('user')
    } else {
      storedUser = { ...userInAuthContext }
    }

    if(storedUser) {
      if(storedUser.role !== 'admin') {
        router.replace('/user/dashboard')
      }

      setUsername(storedUser.username)
      setEmail(storedUser.email)
      setRole(storedUser.role)
    }
  }, [isAuthenticated, userInAuthContext, router])
  */

  useEffect(() => {   
    if(!userInAuthContext) {
      router.replace('/signin')
    } else {
      if(userInAuthContext.role !== 'admin') {
        router.replace('/user/dashboard')
      }

      setUsername(userInAuthContext.username)
      setEmail(userInAuthContext.email)
      setRole(userInAuthContext.role)
      // setUid(userInAuthContext._id)
    }
  }, [userInAuthContext, router])

  return (
    <Container md={{ span: 8, offset: 2 }} className="mt-4">
      <Row>
        <Col md={3}><AdminLinks /></Col>
        <Col md={9}><UserInfo username={username} email={email} role={role} /></Col>
      </Row>
    </Container>
  )
}

export default AdminDashboard