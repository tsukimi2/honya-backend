import { useState, useRef, useContext } from 'react'
import { useRouter } from 'next/router'
import ShowError from '../ui/show-error'
import { signin } from '../../libs/apiUtils/auth-api-utils'
import { localStorage_set } from '../../libs/utils/localStorage-utils'
import { AuthContext } from '../../contexts/AuthContext'


const SigninForm = () => {
  const usernameRef = useRef()
  const passwordRef = useRef()
  //const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const { setUserInAuthContext } = useContext(AuthContext)

  const submitHandler = async (event) => {
    event.preventDefault()

    const username = usernameRef.current.value
    const password = passwordRef.current.value
    setError(null)
    //setLoading(true)

    // ToDo: validation

    try {
      const result = await signin({username, password})

      if(result.user) {
        setUserInAuthContext(result.user)     
        localStorage_set('user', result.user)
      }

      if(result.user.role === 'admin') {
        router.replace('/admin/dashboard')
      } else {
        router.replace('/user/dashboard')
      }
    } catch(err) {
      setError(err.message)
      //setLoading(false)
    }
  }

  return (
    <div className="container col-md-8 offset-md-2">
      {
        error && (
          <ShowError>{error}</ShowError>
        )
      }

      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label text-muted">Username</label>
          <input type="text" className="form-control" id="username" required ref={usernameRef} />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label text-muted">Password</label>
          <input type="password" className="form-control" id="password" required ref={passwordRef} />
        </div>

        <button type="submit" className="btn btn-primary">
            Submit
        </button>
      </form>
    </div>
  )
}

export default SigninForm