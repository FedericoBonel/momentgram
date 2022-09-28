import { useState } from "react";

import "./MomentLikesRow.css";
import MomentLikesCard from "../MomentLikesCard/MomentLikesCard";

const MomentLikesRow = ({ moment, token }) => {
    const [displayMomentLikes, setDisplayMomentLikes] = useState(false);

    const showMoments = (show) => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        setDisplayMomentLikes(show);
    };

    return (
        <>
            <p className="container_likes" onClick={() => showMoments(true)}>
                Liked by {moment.numberLikes}{" "}
                {moment.numberLikes !== 1 ? "people" : "person"}
            </p>
            {displayMomentLikes && (
                <MomentLikesCard
                    momentId={moment._id}
                    token={token}
                    onClose={() => showMoments(false)}
                />
            )}
        </>
    );
};

export default MomentLikesRow;
