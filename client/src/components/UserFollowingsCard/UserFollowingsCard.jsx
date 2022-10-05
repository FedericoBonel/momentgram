import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClose,
    faSpinner,
    faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";

import "./UserFollowingsCard.css";
import Overlay from "../Overlay/Overlay";
import { getUserFollowings } from "../../api/UsersApi";
import UserList from "../UserList/UserList";

const UserFollowingsCard = ({ userId, onClose }) => {
    const navigate = useNavigate();

    const [followings, setFollowings] = useState({
        data: [],
        submitStatus: "idle",
    });
    const [page, setPage] = useState(1);
    const [noMoreFollowings, setNoMoreFollowings] = useState(false);

    useEffect(() => {
        const fetchFollowings = async () => {
            setFollowings((prevLikes) => ({
                ...prevLikes,
                submitStatus: "loading",
            }));

            const { followings, resCode } = await getUserFollowings(
                userId,
                page
            );

            if (resCode === 200) {
                if (followings.length) {
                    setFollowings((prevFollowers) => ({
                        data: [...prevFollowers.data, ...followings],
                        submitStatus: "idle",
                    }));
                } else {
                    setNoMoreFollowings(true);
                    setFollowings((prevLikes) => ({
                        ...prevLikes,
                        submitStatus: "idle",
                    }));
                }
            } else {
                navigate(`/error/${resCode}`);
            }
        };

        fetchFollowings();
    }, [userId, page, navigate]);

    return (
        <>
            <Overlay onClick={onClose} />
            <div className="container_followingscard">
                <div className="container_followingscard-topbr">
                    <p className="container_followingscard-topbr_title">
                        Following
                    </p>
                    <FontAwesomeIcon
                        icon={faClose}
                        className="container_followingscard-topbr_close"
                        onClick={onClose}
                    />
                </div>
                <div className="container_followingscard-list">
                    <UserList users={followings.data} />
                    {followings.submitStatus === "loading" && (
                        <FontAwesomeIcon icon={faSpinner} spin />
                    )}
                    {!(
                        noMoreFollowings ||
                        followings.submitStatus === "loading"
                    ) && (
                        <p
                            onClick={() => setPage((prevPage) => prevPage + 1)}
                            className="container_followingscard-load"
                        >
                            <FontAwesomeIcon icon={faPlusCircle} />
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserFollowingsCard;
