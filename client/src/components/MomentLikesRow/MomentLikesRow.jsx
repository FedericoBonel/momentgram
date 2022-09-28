import { useState } from "react";

import "./MomentLikesRow.css";
import MomentLikesCard from "../MomentLikesCard/MomentLikesCard";

const MomentLikesRow = ({ moment, token }) => {
    const [displayMomentLikes, setDisplayMomentLikes] = useState(false);
    
    return (
        <>
            <p
                className="container_likes"
                onClick={() => setDisplayMomentLikes(true)}
            >
                Liked by {moment.numberLikes}{" "}
                {moment.numberLikes !== 1 ? "people" : "person"}
            </p>
            {displayMomentLikes && (
                <MomentLikesCard
                    momentId={moment._id}
                    token={token}
                    onClose={() => setDisplayMomentLikes(false)}
                />
            )}
        </>
    );
};

export default MomentLikesRow;
