import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./MomentPage.css";
import {
    MomentLikesRow,
    MomentActionsRow,
    MomentCommentList,
    MomentDateRow,
    MomentHeadersRow,
} from "../../components";
import { getMomentById, likeMoment, disLikeMoment } from "../../api/MomentsApi";
import { UserContext } from "../../context/Context";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MomentPage = () => {
    const { user } = useContext(UserContext);

    const { momentId } = useParams();
    const navigate = useNavigate();

    const [moment, setMoment] = useState({ data: {}, submitStatus: "loading" });

    useEffect(() => {
        const fetchMoment = async () => {
            const fetchedMoment = await getMomentById(user.token, momentId);

            if (fetchedMoment.resCode === 200) {
                setMoment({
                    data: fetchedMoment.moment,
                    submitStatus: "success",
                });
            } else if (fetchedMoment.resCode === 404) {
                navigate("/error/404");
            } else {
                navigate(`/error/${fetchedMoment.resCode}`);
            }
        };

        fetchMoment();
    }, [momentId, user, navigate]);

    const onLikeMoment = async (momentId, isLiked) => {
        const { resCode } = isLiked
            ? await disLikeMoment(user.token, momentId)
            : await likeMoment(user.token, momentId);

        if (resCode === 201 || resCode === 200) {
            setMoment((prevMoment) => ({
                ...prevMoment,
                data: { ...prevMoment.data, isLiked: !prevMoment.data.isLiked },
            }));
        } else {
            navigate(`/error/${resCode}`);
        }
    };

    const renderedMoment = moment.submitStatus === "success" && (
        <div className="container_smoment-card">
            {/* Image */}
            <img
                className="container_smoment-img"
                src={`${BACKEND_URL}${moment.data.img[0].url}`}
                alt="moment-img"
            />
            <div className="cotainer_smoment-right">
                {/* Headers */}
                <MomentHeadersRow moment={moment.data} />
                {/* Interactions */}
                <MomentActionsRow
                    onLike={() => onLikeMoment(moment.data._id, moment.data.isLiked)}
                    isLiked={moment.data.isLiked}
                />
                {/* Likes */}
                <MomentLikesRow moment={moment.data} />
                {/* Date */}
                <MomentDateRow dateString={moment.data.createdAt} />
                {/* Comments */}
                <MomentCommentList user={user} moment={moment.data} />
            </div>
        </div>
    );

    return (
        <main className="container_smoment">
            {moment.submitStatus === "loading" && (
                <FontAwesomeIcon
                    className="container_smoment-spinner"
                    spin
                    icon={faSpinner}
                    size="2x"
                />
            )}
            {renderedMoment}
        </main>
    );
};

export default MomentPage;
