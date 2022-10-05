import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./UserProfile.css";
import { UserContext } from "../../context/Context";
import {
    getUserByUsername,
    followUser,
    unfollowUser,
} from "../../api/UsersApi";
import { ProfileHeader, ProfileMomentsList } from "../../components";

const UserProfile = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { username } = useParams();

    const [userData, setUserData] = useState({
        data: {},
        submitStatus: "loading",
    });

    useEffect(() => {
        const fetchUser = async () => {
            const fetchedUsers = await getUserByUsername(user.token, username);

            if (fetchedUsers.resCode === 200) {
                setUserData({
                    data: fetchedUsers.user,
                    submitStatus: "idle",
                });
            } else {
                navigate(`/error/${fetchedUsers.resCode}`);
            }
        };

        fetchUser();
    }, [user, username, navigate]);

    const onFollow = async (userToFollow) => {
        let resCode;
        if (userToFollow.isFollowing) {
            resCode = (await unfollowUser(user.token, userToFollow._id))
                .resCode;
        } else {
            resCode = (await followUser(user.token, userToFollow._id)).resCode;
        }

        if (resCode === 200 || resCode === 201) {
            setUserData((prevData) => ({
                ...prevData,
                data: {
                    ...prevData.data,
                    isFollowing: !prevData.data.isFollowing,
                },
            }));
        } else {
            navigate(`/error/${resCode}`);
        }
    };

    return (
        <div className="container_usrprof">
            {userData.submitStatus === "idle" && (
                <ProfileHeader
                    user={user.user}
                    userData={userData.data}
                    onFollow={() => onFollow(userData.data)}
                />
            )}
            {userData.submitStatus === "loading" && (
                <FontAwesomeIcon icon={faSpinner} spin size="2x" color="grey" />
            )}
            {userData.data?._id && (
                <ProfileMomentsList
                    username={userData.data.username}
                    userId={userData.data._id}
                    token={user.token}
                />
            )}
        </div>
    );
};

export default UserProfile;
