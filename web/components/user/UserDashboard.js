import { useContext, useEffect, useState } from "react"
import { useRouter } from 'next/router'
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

    if(!user) {
      user = localStorage_get('user')
    }

    if(user) {
      if(user.role === 'admin') {
        router.replace('/admin/dashboard')
      }

      setUsername(user.username)
      setEmail(user.email)
      setRole(user.role)
    }
  })

  return (
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
  )
}

export default UserDashboard
