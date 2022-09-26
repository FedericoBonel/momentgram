import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTh, faHeart, faComment } from "@fortawesome/free-solid-svg-icons";

import "./ProfileMomentsList.css";
import { MomentImages } from "../";

let ProfileMomentsList = ({ username, moments }) => {
    const renderedMoments = moments.map((moment) => (
        <Link
            to={`/moments/${moment._id}/`}
            key={moment._id}
            className="container_usrmoments-moment"
        >
            <MomentImages
                images={moment.img.length ? moment.img[0] : moment.img}
            />

            <div className="container_surmoments-moment_ovrlay">
                <span className="container_surmoments-moment_ovrlayback"></span>
                <p>
                    {moment.numberLikes} <FontAwesomeIcon icon={faHeart} />
                </p>
                <p>
                    {moment.numberComments}{" "}
                    <FontAwesomeIcon icon={faComment} flip="horizontal" />
                </p>
            </div>
        </Link>
    ));

    return (
        <div className="container_usrmoments">
            <div className="container_usrmoments-topbr">
                <div className="container_usrmoments-topbr_link">
                    <Link to={`/users/${username}`}>
                        <FontAwesomeIcon icon={faTh} /> POSTS
                    </Link>
                </div>
            </div>
            <div className="container_usrmoments-grid">{renderedMoments}</div>
        </div>
    );
};

export default ProfileMomentsList;
