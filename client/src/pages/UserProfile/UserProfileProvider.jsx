import { useParams } from "react-router-dom";

import UserProfile from "./UserProfile";

/**
 * This react component sets the key of the profile as the username
 * to trigger a re render and state reset in the user profile component 
 * when navigating between profiles
 */
const UserProfileProvider = () => {
    const { username } = useParams();
    return <UserProfile key={username} />;
};

export default UserProfileProvider;
