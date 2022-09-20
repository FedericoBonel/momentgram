import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faEllipsis } from "@fortawesome/free-solid-svg-icons";

import "./MomentComment.css";
import { getDaysAgoFrom } from "../../api/DateApi";

const MomentComment = ({ comment, user, onDelete }) => {
    const [displayOptions, setDisplayOptions] = useState(false);

    const options = (show) => {
        if (show) {
            document.body.style.overflow = "hidden";
            setDisplayOptions(true);
        } else {
            document.body.style.overflow = "auto";
            setDisplayOptions(false);
        }
    };

    const deleteComment = () => {
        options(false);
        onDelete();
    };

    const renderedComment = (
        <div className="container_comment">
            <FontAwesomeIcon
                className="container_comment-usrimg"
                icon={faUserCircle}
            />
            <div className="container_comment-usrinfo">
                <h2>{comment.createdBy.username}</h2>
                <p>{comment.comment}</p>
                <div className="container_comment-usrinfo_btm">
                    <p className="container_comment-date">{`${getDaysAgoFrom(
                        comment.createdAt
                    )}d`}</p>
                    {user.user.id === comment.createdBy._id && onDelete && (
                        <FontAwesomeIcon
                            onClick={() => options(true)}
                            icon={faEllipsis}
                            className="container_comment-optionsbtn"
                        />
                    )}
                </div>
            </div>
        </div>
    );

    const renderedOptions = (
        <>
            <div className="container_comment-options_back"></div>
            <div className="container_comment-options">
                <button
                    className="container_comment-options-delete"
                    onClick={deleteComment}
                >
                    Delete
                </button>
                <button
                    className="container_comment-options-cancel"
                    onClick={() => options(false)}
                >
                    Cancel
                </button>
            </div>
        </>
    );

    return (
        <>
            {renderedComment}
            {displayOptions && renderedOptions}
        </>
    );
};

export default MomentComment;