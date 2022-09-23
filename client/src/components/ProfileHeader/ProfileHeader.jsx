import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserCheck,
    faGear,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";

import "./ProfileHeader.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ProfileHeader = ({ user, userData, onFollow }) => {
    const [submitStatus, setSubmitStatus] = useState("idle");

    const handleFollow = async () => {
        setSubmitStatus("loading");

        await onFollow();

        setSubmitStatus("idle");
    };

    return (
        <header className="container_profileheader">
            <img
                className="container_profileheader-img"
                src={
                    userData.profileImg
                        ? `${BACKEND_URL}/images/${userData.profileImg.url}`
                        : `${BACKEND_URL}/images/profileph.jpg`
                }
                alt="user-profileimg"
            />
            <div className="container_profileheader-data">
                <div className="container_profileheader-dataf">
                    <h2 className="container_profileheader-dataun">
                        {userData.username}
                    </h2>
                    {user.id !== userData._id ? (
                        <button
                            onClick={handleFollow}
                            className={` ${
                                userData.isFollowing
                                    ? "container_profileheader-unfollow_button"
                                    : "container_profileheader-follow_button"
                            } `}
                        >
                            {userData.isFollowing ? (
                                <FontAwesomeIcon icon={faUserCheck} />
                            ) : (
                                "Follow"
                            )}
                            {submitStatus === "loading" && (
                                <FontAwesomeIcon icon={faSpinner} spin />
                            )}
                        </button>
                    ) : (
                        <Link to={`/profile/settings`}>
                            <button>
                                <FontAwesomeIcon icon={faGear} />
                            </button>
                        </Link>
                    )}
                </div>
                <div className="container_profileheader-datas">
                    <p>
                        <b>{userData.numberMoments}</b> moments
                    </p>
                    <p>
                        <b>{userData.numberFollowers}</b> followers
                    </p>
                    <p>
                        <b>{userData.numberFollowing}</b> following
                    </p>
                </div>
                {userData.description && (
                    <p className="container_profileheader-datadesc">
                        {userData.description}
                    </p>
                )}
            </div>
        </header>
    );
};

export default ProfileHeader;
