import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClose,
    faSpinner,
    faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";

import "./MomentLikesCard.css";
import { getMomentLikes } from "../../api/MomentsApi";
import Overlay from "../Overlay/Overlay";
import UserList from "../UserList/UserList";

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

    return (
        <>
            <Overlay onClick={onClose} />
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
                    <UserList
                        users={momentLikes.data.map((like) => like.createdBy)}
                    />
                    {momentLikes.submitStatus === "loading" && (
                        <FontAwesomeIcon icon={faSpinner} spin />
                    )}
                    {!(
                        noMoreLikes || momentLikes.submitStatus === "loading"
                    ) && (
                        <p
                            onClick={() => setPage((prevPage) => prevPage + 1)}
                            className="container_likescard-load"
                        >
                            <FontAwesomeIcon icon={faPlusCircle} />
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default MomentLikesCard;
