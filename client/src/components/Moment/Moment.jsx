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
    MomentImages,
} from "../";
import { deleteComment, postNewComment } from "../../api/MomentsApi";

let Moment = ({ moment, user, onLikeMoment }) => {
    const navigate = useNavigate();
    const [newComment, setNewComment] = useState();

    const onAddComment = async (comment) => {
        const postedComment = await postNewComment(
            user.token,
            moment._id,
            comment
        );

        if (postedComment.resCode === 201) {
            setNewComment(postedComment.comment);
        } else {
            navigate(`/error/${newComment.resCode}`);
        }
    };

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
            {/* TODO change this when carousel implemented */}
            <MomentImages
                className="container_moment-img"
                images={moment.img}
            />
            {/* Interactions */}
            <MomentActionsRow
                isLiked={moment.isLiked}
                onLike={() => onLikeMoment(moment._id, moment.isLiked)}
            />
            {/* Likes */}
            <MomentLikesRow moment={moment} />
            {/* Description */}
            <p className="container_moment-description">
                <b>
                    <Link to={`/users/${moment.createdBy.username}`}>
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
                        onDelete={() => onDeleteComment(newComment._id)}
                    />
                </div>
            )}
            {/* Date */}
            <MomentDateRow dateString={moment.createdAt} />
            {/* New comment */}
            <MomentCommentForm addComment={onAddComment} />
        </article>
    );
};

export default memo(Moment);
