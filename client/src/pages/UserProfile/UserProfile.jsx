import "./UserProfile.css"
import { ProfileHeader, ProfileMomentsList } from "../../components"

const UserProfile = () => {
  return (
    <div className="container_usrprof">
        <ProfileHeader />
        <ProfileMomentsList/>
    </div>
  )
}

export default UserProfile