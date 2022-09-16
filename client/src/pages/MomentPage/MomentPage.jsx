import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./MomentPage.css";
import {
    MomentLikesRow,
    MomentActionsRow,
    MomentComment,
    MomentCommentForm,
    MomentDateRow,
    MomentHeadersRow,
} from "../../components";
import {
    getMomentById,
    getMomentComments,
    deleteComment,
} from "../../api/MomentsApi";
import { UserContext } from "../../context/Context";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MomentPage = () => {
    const { user } = useContext(UserContext);
    const [moment, setMoment] = useState({ data: {}, submitStatus: "loading" });
    const [momentComments, setMomentComments] = useState({
        data: [],
        submitStatus: "loading",
    });

    const { momentId } = useParams();
    const navigate = useNavigate();

    const addComment = (newComment) => {
        setMomentComments((prevComments) => ({
            ...prevComments,
            data: [newComment, ...prevComments.data],
        }));
    };

    const onDeleteComment = async (commentId) => {
        const deletedComment = await deleteComment(
            user.token,
            moment.data._id,
            commentId
        );

        if (deletedComment.resCode === 200) {
            setMomentComments((prevComments) => ({
                ...prevComments,
                data: prevComments.data.filter(
                    (comment) => comment._id !== commentId
                ),
            }));
        } else {
            navigate(`/error/${deletedComment.resCode}`);
        }
    };

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

        const fetchComments = async () => {
            const fetchedComments = await getMomentComments(
                user.token,
                momentId,
                1
            );

            if (fetchedComments.resCode === 200) {
                setMomentComments({
                    data: fetchedComments.comments,
                    submitStatus: "success",
                });
            } else if (fetchedComments.resCode === 404) {
                navigate("/error/404");
            } else {
                navigate(`/error/${fetchedComments.resCode}`);
            }
        };

        fetchMoment();
        fetchComments();
    }, [momentId, user, navigate]);

    const renderedComments = momentComments.data.map((comment) => (
        <MomentComment
            comment={comment}
            key={comment._id}
            user={user}
            onDelete={() => onDeleteComment(comment._id)}
        />
    ));

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
                {/* Comments */}
                <div className="container_smoment-comts">
                    <MomentComment
                        comment={{
                            ...moment.data,
                            comment: moment.data.description,
                        }}
                        user={user}
                    />
                    {momentComments.submitStatus === "success" &&
                        renderedComments}
                </div>
                {/* Interactions */}
                <MomentActionsRow />
                {/* Likes */}
                <MomentLikesRow moment={moment.data} />
                {/* Date */}
                <MomentDateRow dateString={moment.data.createdAt} />
                {/* New comment */}
                <MomentCommentForm
                    token={user.token}
                    momentId={moment.data._id}
                    addComment={addComment}
                />
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
