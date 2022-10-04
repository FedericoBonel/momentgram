import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSpinner, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import "./UserFollowersCard.css";
import Overlay from "../Overlay/Overlay";
import { getUserFollowers } from "../../api/UsersApi";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UserFollowersCard = ({ userId, onClose }) => {
    const navigate = useNavigate();

    const [followers, setFollowers] = useState({
        data: [],
        submitStatus: "idle",
    });
    const [page, setPage] = useState(1);
    const [noMoreFollowers, setNoMoreFollowers] = useState(false);

    useEffect(() => {
        const fetchFollowers = async () => {
            setFollowers((prevLikes) => ({
                ...prevLikes,
                submitStatus: "loading",
            }));

            const { followers, resCode } = await getUserFollowers(userId, page);

            if (resCode === 200) {
                if (followers.length) {
                    setFollowers((prevFollowers) => ({
                        data: [...prevFollowers.data, ...followers],
                        submitStatus: "idle",
                    }));
                } else {
                    setNoMoreFollowers(true);
                    setFollowers((prevLikes) => ({
                        ...prevLikes,
                        submitStatus: "idle",
                    }));
                }
            } else {
                navigate(`/error/${resCode}`);
            }
        };

        fetchFollowers();
    }, [userId, page, navigate]);

    const renderedFollowers = followers.data.map((user) => (
        <Link to={`/users/${user.username}`} key={user._id}>
            <div className="container_followerscard-usr">
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
            <div className="container_followerscard">
                <div className="container_followerscard-topbr">
                    <p className="container_followerscard-topbr_title">Followers</p>
                    <FontAwesomeIcon
                        icon={faClose}
                        className="container_followerscard-topbr_close"
                        onClick={onClose}
                    />
                </div>
                <div className="container_followerscard-list">
                    {renderedFollowers}
                    {followers.submitStatus === "loading" && (
                        <FontAwesomeIcon icon={faSpinner} spin />
                    )}
                    {!(noMoreFollowers || followers.submitStatus === "loading") && (
                        <p
                            onClick={() => setPage((prevPage) => prevPage + 1)}
                            className="container_followerscard-load"
                        >
                            <FontAwesomeIcon icon={faPlusCircle}/>
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserFollowersCard;
