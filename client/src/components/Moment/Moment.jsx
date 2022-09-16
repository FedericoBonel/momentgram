import { Link } from "react-router-dom";
import { memo, useState } from "react";

import "./Moment.css";
import {
    MomentLikesRow,
    MomentActionsRow,
    MomentComment,
    MomentCommentForm,
    MomentDateRow,
    MomentHeadersRow,
} from "../";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

let Moment = ({ moment, token }) => {
    const [newComment, setNewComment] = useState();

    return (
        <article className="container_moment">
            {/* Headers */}
            <MomentHeadersRow moment={moment} />
            {/* Images */}
            <img
                className="container_moment-img"
                src={`${BACKEND_URL}${moment.img[0].url}`}
                alt="moment-img"
            />
            {/* Interactions */}
            <MomentActionsRow />
            {/* Likes */}
            <MomentLikesRow moment={moment} />
            {/* Description */}
            <p className="container_moment-description">
                <b>
                    <Link to={`/users/${moment.createdBy._id}`}>
                        {moment.createdBy.username}
                    </Link>
                </b>{" "}
                {moment.description}
            </p>
            {/* Comments */}
            <Link
                className="container_moment-comments"
                to={`/moments/${moment._id}`}
            >
                View all {moment.numberComments} comment
                {moment.numberComments > 1 && "s"}
            </Link>
            {newComment && (
                <div className="container_moment-newcmmt">
                    <MomentComment comment={newComment} />
                </div>
            )}
            {/* Date */}
            <MomentDateRow dateString={moment.createdAt} />
            {/* New comment */}
            <MomentCommentForm
                momentId={moment._id}
                token={token}
                addComment={setNewComment}
            />
        </article>
    );
};

export default memo(Moment);
