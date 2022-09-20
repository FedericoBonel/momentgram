import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./MomentCommentList.css";
import { MomentComment, MomentCommentForm } from "../";
import {
    getMomentComments,
    deleteComment,
    postNewComment,
} from "../../api/MomentsApi";

const MomentCommentList = ({ user, moment }) => {
    const navigate = useNavigate();
    const [momentComments, setMomentComments] = useState({
        data: [],
        submitStatus: "loading",
    });
    const [commentPage, setCommentPage] = useState(1);
    const [noMoreComments, setNoMoreComments] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            setMomentComments((prevComments) => ({
                ...prevComments,
                submitStatus: "loading",
            }));

            const fetchedComments = await getMomentComments(
                user.token,
                moment._id,
                commentPage
            );

            if (fetchedComments.resCode === 200) {
                if (fetchedComments.comments.length) {
                    setMomentComments((prevComments) => ({
                        data: [
                            ...prevComments.data,
                            ...fetchedComments.comments,
                        ],
                        submitStatus: "success",
                    }));
                } else {
                    setNoMoreComments(true);
                    setMomentComments((prevComments) => ({
                        ...prevComments,
                        submitStatus: "success",
                    }));
                }
            } else if (fetchedComments.resCode === 404) {
                navigate("/error/404");
            } else {
                navigate(`/error/${fetchedComments.resCode}`);
            }
        };

        fetchComments();
    }, [moment, navigate, user, commentPage]);

    const addComment = async (newComment) => {
        const savedComment = await postNewComment(
            user.token,
            moment._id,
            newComment
        );

        if (savedComment.resCode === 201) {
            setMomentComments((prevComments) => ({
                ...prevComments,
                data: [savedComment.comment, ...prevComments.data],
            }));
        } else {
            navigate(`/error/${savedComment.resCode}`);
        }
    };

    const onDeleteComment = async (commentId) => {
        const deletedComment = await deleteComment(
            user.token,
            moment._id,
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

    const renderedComments = momentComments.data.map((comment) => (
        <MomentComment
            comment={comment}
            key={comment._id}
            user={user}
            onDelete={() => onDeleteComment(comment._id)}
        />
    ));

    const renderedLoadBtn = !noMoreComments && (
        <button
            className="container_dashboard-loadbtn"
            onClick={() => setCommentPage((prevPage) => prevPage + 1)}
        >
            Load more
        </button>
    );

    return (
        <>
            <div className="container_comtslist">
                {moment.description && (
                    <MomentComment
                        comment={{
                            ...moment,
                            comment: moment.description,
                        }}
                        user={user}
                    />
                )}
                {renderedComments}
                {momentComments.submitStatus === "loading" ? (
                    <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        className="container_comtslist-spinner"
                    />
                ) : (
                    renderedLoadBtn
                )}
            </div>
            <MomentCommentForm addComment={addComment} />
        </>
    );
};

export default MomentCommentList;
