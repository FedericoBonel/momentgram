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
    MomentImages,
} from "../../components";
import {
    getMomentById,
    likeMoment,
    disLikeMoment,
    deleteMomentById,
} from "../../api/MomentsApi";
import { UserContext } from "../../context/Context";

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

    const onDeleteMoment = async () => {
        const { resCode } = await deleteMomentById(user.token, moment.data._id);

        if (resCode === 200) {
            navigate("/dashboard");
        } else {
            navigate(`/error/${resCode}`);
        }
    };

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
        <div className="container_smoment-card scale-in-center">
            {/* Image */}
            <MomentImages
                images={moment.data.img}
                imgClass={
                    moment.data.img.length > 1
                        ? "container_smoment-imgs"
                        : "container_smoment-img"
                }
                containerClass={"container_smoment-contimg"}
                sliderClass={"container_smoment-slider"}
            />
            <div className="cotainer_smoment-right">
                {/* Headers */}
                <MomentHeadersRow
                    moment={moment.data}
                    user={user.user}
                    onDelete={onDeleteMoment}
                />
                {/* Interactions */}
                <MomentActionsRow
                    onLike={() =>
                        onLikeMoment(moment.data._id, moment.data.isLiked)
                    }
                    isLiked={moment.data.isLiked}
                />
                {/* Likes */}
                {moment.data.numberLikes > 0 && (
                    <MomentLikesRow moment={moment.data} token={user.token} />
                )}
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
