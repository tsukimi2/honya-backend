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

    if(!user) {
      user = localStorage_get('user')
    }
console.log('user')
console.log(user)
    if(user) {
      if(user.role !== 'admin') {
        router.replace('/user/dashboard')
      }

      setUsername(user.username)
      setEmail(user.email)
      setRole(user.role)
    }
  })

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