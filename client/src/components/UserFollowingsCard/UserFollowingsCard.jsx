import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClose,
    faSpinner,
    faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";

import "./UserFollowingsCard.css";
import Overlay from "../Overlay/Overlay";
import { getUserFollowings } from "../../api/UsersApi";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UserFollowingsCard = ({userId, onClose}) => {
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

    const renderedFollowings = followings.data.map((user) => (
        <Link to={`/users/${user.username}`} key={user._id}>
            <div className="container_followingscard-usr">
                <img
                    src={
                        user.profileImg
                            ? `${BACKEND_URL}${user.profileImg.url}`
                            : `${BACKEND_URL}/images/profileph.jpg`
                    }
                    alt="profile-img"
                />
                <p>{user.username}</p>
            </div>
        </Link>
    ));

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
                    {renderedFollowings}
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
