import { Link } from "react-router-dom";

import "./MomentLikesRow.css";

const MomentLikesRow = ({moment}) => {
    return (
        <Link
            to={`/moments/${moment._id}/likes`}
            className="container_likes"
        >
            Liked by {moment.numberLikes} person
            {moment.numberLikes !== 1 && "s"}
        </Link>
    );
};

export default MomentLikesRow;
