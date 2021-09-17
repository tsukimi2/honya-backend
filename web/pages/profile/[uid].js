import { useRouter } from "next/router"
import { useUser } from "../../libs/apiUtils/user-api-utils"
import Profile from "../../components/user/Profile"
import LoadingOverlay from '../../components/ui/LoadingOverlay'
import ShowAlert from "../../components/ui/ShowAlert"

const ProfilePage = () => {
  const router = useRouter()
  const { uid } = router.query
  const { user, err, isLoading, isError } = useUser({ uid })

  return (
    <>
    { isLoading && (<LoadingOverlay />) }
    {
      isError && (
        <ShowAlert>{ err && err.errmsg ? err.errmsg : 'Error loading user profile' }</ShowAlert>
      )
    }
    {
      user && (
        <Profile
          user={user}
        />
      )
    }
    </>
  )
}

export default ProfilePage