import { Link, useNavigate } from "react-router-dom";
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
import { deleteComment } from "../../api/MomentsApi";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

let Moment = ({ moment, user }) => {
    const navigate = useNavigate();
    const [newComment, setNewComment] = useState();

    const onDeleteComment = async (commentId) => {
        const deletedComment = await deleteComment(
            user.token,
            moment._id,
            commentId
        );

        if (deletedComment.resCode === 200) {
            setNewComment();
        } else {
            navigate(`/error/${deletedComment.resCode}`);
        }
    };

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
                    <MomentComment
                        comment={newComment}
                        user={user}
                        onDelete={() =>
                            onDeleteComment(newComment._id)
                        }
                    />
                </div>
            )}
            {/* Date */}
            <MomentDateRow dateString={moment.createdAt} />
            {/* New comment */}
            <MomentCommentForm
                momentId={moment._id}
                token={user.token}
                addComment={setNewComment}
            />
        </article>
    );
};

export default memo(Moment);
