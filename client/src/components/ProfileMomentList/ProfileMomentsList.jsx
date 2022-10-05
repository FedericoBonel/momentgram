import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTh,
    faHeart,
    faComment,
    faPlusCircle,
    faSpinner
} from "@fortawesome/free-solid-svg-icons";

import "./ProfileMomentsList.css";
import { MomentImages } from "../";
import { getUserMomentsById } from "../../api/UsersApi";

let ProfileMomentsList = ({ userId, username, token }) => {
    const navigate = useNavigate();

    const [userMoments, setUserMoments] = useState({
        data: [],
        submitStatus: "loading",
    });
    const [momentsPage, setMomentsPage] = useState(1);
    const [noMoreMoments, setNoMoreMoments] = useState(false);

    useEffect(() => {
        const fetchUserMoments = async () => {
            setUserMoments((prevMoments) => ({
                ...prevMoments,
                submitStatus: "loading",
            }));

            const fetchedUserMoments = await getUserMomentsById(
                token,
                userId,
                momentsPage
            );

            if (fetchedUserMoments.resCode === 200) {
                if (!fetchedUserMoments.moments.length) {
                    setNoMoreMoments(true);
                    setUserMoments((prevMoments) => ({
                        ...prevMoments,
                        submitStatus: "idle",
                    }));
                } else {
                    setUserMoments((prevMoments) => ({
                        data: [
                            ...prevMoments.data,
                            ...fetchedUserMoments.moments,
                        ],
                        submitStatus: "idle",
                    }));
                }
            } else {
                navigate(`/error/${fetchedUserMoments.resCode}`);
            }
        };

        if (userId) {
            fetchUserMoments();
        }
    }, [token, userId, navigate, momentsPage]);

    const renderedMoments = userMoments.data.map((moment) => (
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

    const renderedLoadBtn = !noMoreMoments ? (
        <button
            className="container_usrmoments-loadmore"
            onClick={() => setMomentsPage((prevPage) => prevPage + 1)}
        >
            <FontAwesomeIcon icon={faPlusCircle} />
        </button>
    ) : (
        <p className="container_usrmoments-nomore">
            You've reached the end of this user's moments!
        </p>
    );

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
            {userMoments.submitStatus === "loading" && (
                <FontAwesomeIcon icon={faSpinner} spin size="2x" color="grey" />
            )}
            {userMoments.submitStatus === "idle" && renderedLoadBtn}
        </div>
    );
};

export default ProfileMomentsList;
