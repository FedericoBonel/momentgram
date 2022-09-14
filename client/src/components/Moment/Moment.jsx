import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserCircle,
    faComment,
    faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState, memo } from "react";

import "./Moment.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

let Moment = ({ moment }) => {
    const oneDayMs = 1000 * 60 * 60 * 24;

    const diffDates =
        new Date().getTime() - new Date(moment.createdAt).getTime();

    const madeAgo = Math.round(diffDates / oneDayMs);

    const [comment, setComment] = useState("");

    const canComment = Boolean(comment);

    const onChange = (e) => {
        setComment(e.target.value);
    };

    return (
        <article className="container_moment">
            {/* Headers */}
            <div className="container_moment-headers">
                <FontAwesomeIcon
                    icon={faUserCircle}
                    className="container_moment-headersusrimg"
                />
                <div>
                    <h2>{moment.createdBy.username}</h2>
                    <p>{moment.location}</p>
                </div>
            </div>
            {/* Images */}
            <img
                className="container_moment-img"
                src={`${BACKEND_URL}${moment.img[0].url}`}
                alt="moment-img"
            />
            {/* Interactions */}
            <div className="container_moment-actions">
                <button>
                    <FontAwesomeIcon icon={faHeart} />
                </button>
                <button>
                    <FontAwesomeIcon icon={faComment} flip="horizontal" />
                </button>
            </div>
            {/* Likes */}
            <Link
                to={`/moments/${moment._id}/likes`}
                className="container_moment-likes"
            >
                Liked by {moment.numberLikes} person
                {moment.numberLikes > 1 && "s"}
            </Link>
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
                to={`/moments/${moment._id}#comments`}
            >
                View all {moment.numberComments} comment
                {moment.numberComments > 1 && "s"}
            </Link>
            {/* Date */}
            <p className="container_moment-date">
                {madeAgo > 0
                    ? `${madeAgo} DAY${madeAgo > 1 && "S"} AGO`
                    : "TODAY"}
            </p>
            {/* New comment */}
            <form className="container_moment-newcomment">
                <textarea
                    name="newComment"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={onChange}
                />
                <button disabled={!canComment}>Post</button>
            </form>
        </article>
    );
};

export default memo(Moment);
