import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

import "./MomentComment.css";
import { getDaysAgoFrom } from "../../api/DateApi";

const MomentComment = ({ comment }) => {
    return (
        <div className="container_comment">
            <FontAwesomeIcon
                className="container_comment-usrimg"
                icon={faUserCircle}
            />
            <div>
                <h2>{comment.createdBy.username}</h2>
                <p>{comment.comment}</p>
                <p className="container_comment-date">{`${getDaysAgoFrom(
                    comment.createdAt
                )}d`}</p>
            </div>
        </div>
    );
};

export default MomentComment;
