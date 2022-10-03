import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faEllipsis } from "@fortawesome/free-solid-svg-icons";

import "./MomentComment.css";
import { getDaysAgoFrom } from "../../api/DateApi";
import Overlay from "../Overlay/Overlay";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MomentComment = ({ comment, user, onDelete, momentAuthor }) => {
    const [displayOptions, setDisplayOptions] = useState(false);

    const deleteComment = () => {
        setDisplayOptions(false);
        onDelete();
    };

    const renderedComment = (
        <div className="container_comment">
            <Link to={`/users/${comment.createdBy.username}`}>
                <img
                    className="container_comment-usrimg"
                    src={
                        comment.createdBy.profileImg
                            ? `${BACKEND_URL}${comment.createdBy.profileImg.url}`
                            : `${BACKEND_URL}/images/profileph.jpg`
                    }
                    alt="profile-img"
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
                        onClick={() => setDisplayOptions(true)}
                        icon={faEllipsis}
                        className="container_comment-optionsbtn"
                    />
                )}
        </div>
    );

    const renderedOptions = (
        <>
            <Overlay onClick={() => setDisplayOptions(false)}/>
            <div className="container_comment-options">
                <button
                    className="container_comment-options-delete"
                    onClick={deleteComment}
                >
                    Delete
                </button>
                <button
                    className="container_comment-options-cancel"
                    onClick={() => setDisplayOptions(false)}
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
