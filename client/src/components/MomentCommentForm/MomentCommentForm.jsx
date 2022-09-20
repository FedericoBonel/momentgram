import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./MomentCommentForm.css";

const MomentCommentForm = ({ addComment }) => {
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

        await addComment(comment.data);

        setComment({ data: "", submitStatus: "idle" });
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
