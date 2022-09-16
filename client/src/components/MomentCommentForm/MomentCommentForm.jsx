import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./MomentCommentForm.css";
import { postNewComment } from "../../api/MomentsApi";

const MomentCommentForm = ({ token, momentId, addComment }) => {
    const navigate = useNavigate();
    const [comment, setComment] = useState({ data: "", submitStatus: "idle" });

    const canComment = Boolean(comment.data);

    const onChange = (e) => {
        setComment((prevComment) => ({
            ...prevComment,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        setComment((prevComment) => ({
            ...prevComment,
            submitStatus: "loading",
        }));

        const newComment = await postNewComment(token, momentId, comment.data);

        if (newComment.resCode === 201) {
            addComment(newComment.comment);
            setComment({ data: "", submitStatus: "idle" });
        } else {
            navigate(`/error/${newComment.resCode}`);
        }
    };

    return (
        <form className="container_newcomment">
            <textarea
                name="data"
                placeholder="Add a comment..."
                maxLength={250}
                value={comment.data}
                onChange={onChange}
            />
            <button disabled={!canComment} onClick={onSubmit}>
                {comment.submitStatus === "loading" ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                    "Post"
                )}
            </button>
        </form>
    );
};

export default MomentCommentForm;
