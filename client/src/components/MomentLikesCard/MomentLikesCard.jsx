import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./MomentLikesCard.css";
import { getMomentLikes } from "../../api/MomentsApi";
import Overlay from "../Overlay/Overlay";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MomentLikesCard = ({ momentId, token, onClose }) => {
    const navigate = useNavigate();
    const [momentLikes, setMomentLikes] = useState({
        data: [],
        submitStatus: "idle",
    });
    const [page, setPage] = useState(1);
    const [noMoreLikes, setNoMoreLikes] = useState(false);

    useEffect(() => {
        const fetchLikes = async () => {
            setMomentLikes((prevLikes) => ({
                ...prevLikes,
                submitStatus: "loading",
            }));

            const { likes, resCode } = await getMomentLikes(
                token,
                momentId,
                page
            );

            if (resCode === 200) {
                if (likes.length) {
                    setMomentLikes((prevLikes) => ({
                        data: [...prevLikes.data, ...likes],
                        submitStatus: "idle",
                    }));
                } else {
                    setNoMoreLikes(true);
                    setMomentLikes((prevLikes) => ({
                        ...prevLikes,
                        submitStatus: "idle",
                    }));
                }
            } else {
                navigate(`/error/${resCode}`);
            }
        };

        fetchLikes();
    }, [momentId, token, page, navigate]);

    const renderedLikes = momentLikes.data.map((like) => (
        <Link to={`/users/${like.createdBy.username}`} key={like._id}>
            <div className="container_likescard-usr">
                <img
                    src={
                        like.createdBy.profileImg
                            ? `${BACKEND_URL}${like.createdBy.profileImg.url}`
                            : `${BACKEND_URL}/images/profileph.jpg`
                    }
                    alt="profile-img"
                />
                <p>{like.createdBy.username}</p>
            </div>
        </Link>
    ));

    return (
        <>
            <Overlay onClick={onClose}/>
            <div className="container_likescard">
                <div className="container_likescard-topbr">
                    <p className="container_likescard-topbr_title">Likes</p>
                    <FontAwesomeIcon
                        icon={faClose}
                        className="container_likescard-topbr_close"
                        onClick={onClose}
                    />
                </div>
                <div className="container_likescard-list">
                    {renderedLikes}
                    {momentLikes.submitStatus === "loading" && (
                        <FontAwesomeIcon icon={faSpinner} spin />
                    )}
                    {!(noMoreLikes || momentLikes.submitStatus === "loading") && (
                        <p
                            onClick={() => setPage((prevPage) => prevPage + 1)}
                            className="container_likescard-load"
                        >
                            Load more
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default MomentLikesCard;
