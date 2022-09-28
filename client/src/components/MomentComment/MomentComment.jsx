import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faEllipsis } from "@fortawesome/free-solid-svg-icons";

import "./MomentComment.css";
import { getDaysAgoFrom } from "../../api/DateApi";
import Overlay from "../Overlay/Overlay";

const MomentComment = ({ comment, user, onDelete, momentAuthor }) => {
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
            <Link to={`/users/${comment.createdBy.username}`}>
                <FontAwesomeIcon
                    className="container_comment-usrimg"
                    icon={faUserCircle}
                />
            </Link>
            <div className="container_comment-usrinfo">
                <Link to={`/users/${comment.createdBy.username}`}>
                    <h2>{comment.createdBy.username}</h2>
                </Link>
                <p>{comment.comment}</p>
                <div className="container_comment-usrinfo_btm">
                    <p className="container_comment-date">{`${getDaysAgoFrom(
                        comment.createdAt
                    )}d`}</p>
                </div>
            </div>
            {(user.user.id === comment.createdBy._id ||
                user.user.id === momentAuthor) &&
                onDelete && (
                    <FontAwesomeIcon
                        onClick={() => options(true)}
                        icon={faEllipsis}
                        className="container_comment-optionsbtn"
                    />
                )}
        </div>
    );

    const renderedOptions = (
        <>
            <Overlay onClick={() => options(false)}/>
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
