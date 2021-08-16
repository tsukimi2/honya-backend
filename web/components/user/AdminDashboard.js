import { useContext, useEffect, useState } from "react"
import { useRouter } from 'next/router'
import { localStorage_get } from '../../libs/utils/localStorage-utils'
import { AuthContext } from "../../contexts/AuthContext"
import UserInfo from "./UserInfo"
import AdminLinks from "./AdminLinks"
import { isAuthenticated } from '../../libs/utils/auth-utils'

const AdminDashboard = () => {
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
      if(storedUser.role !== 'admin') {
        router.replace('/user/dashboard')
      }

      setUsername(storedUser.username)
      setEmail(storedUser.email)
      setRole(storedUser.role)
    }
  }, [user, router])

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3"><AdminLinks /></div>
        <div className="col-9"><UserInfo username={username} email={email} role={role} /></div>
      </div>
    </div>
  )
}

export default AdminDashboard