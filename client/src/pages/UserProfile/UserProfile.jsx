import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./UserProfile.css";
import { UserContext } from "../../context/Context";
import {
    getUserByUsername,
    getUserMomentsById,
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

    const [userMoments, setUserMoments] = useState({
        data: [],
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

    useEffect(() => {
        const fetchUserMoments = async () => {
            const fetchedUserMoments = await getUserMomentsById(
                user.token,
                userData.data._id
            );

            if (fetchedUserMoments.resCode === 200) {
                setUserMoments({
                    data: fetchedUserMoments.moments,
                    submitStatus: "idle",
                });
            } else {
                navigate(`/error/${fetchedUserMoments.resCode}`);
            }
        };

        if (userData.data?._id) {
            fetchUserMoments();
        }
    }, [user, userData, navigate]);

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
                data: { ...prevData.data, isFollowing: !prevData.data.isFollowing },
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
            {userMoments.submitStatus === "idle" && (
                <ProfileMomentsList
                    username={userData.data.username}
                    moments={userMoments.data}
                />
            )}
            {(userMoments.submitStatus === "loading" ||
                userData.submitStatus === "loading") && (
                <FontAwesomeIcon icon={faSpinner} spin size="2x" color="grey" />
            )}
        </div>
    );
};

export default UserProfile;
