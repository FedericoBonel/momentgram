import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import "./ProfileHeader.css"

const ProfileHeader = () => {
    const navigate = useNavigate();
    const {username} = useParams();

    
  return (
    <div className="container_profileheader">
        
    </div>
  )
}

export default ProfileHeader