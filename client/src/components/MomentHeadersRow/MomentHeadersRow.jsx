import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

import "./MomentHeadersRow.css";
import OutsideClickListener from "../OutsideClickListener/OutsideClickListener";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MomentHeadersRow = ({ moment, user, onDelete }) => {
    const [showEdit, setShowEdit] = useState();

    const referenceToOptions = useRef(null);
    OutsideClickListener(referenceToOptions, () => setShowOptions(false));

    const setShowOptions = (show) => {
        if (show) {
            document.body.style.overflow = "hidden";
            setShowEdit(true);
        } else {
            document.body.style.overflow = "auto";
            setShowEdit(false);
        }
    };

    const deleteMoment = () => {
        setShowOptions(false);
        onDelete();
    };

    const renderedHeader = (
        <div className="container_headerrow">
            <div className="container_headerrow-user">
                <Link to={`/users/${moment.createdBy.username}`}>
                    <img
                        src={
                            user.profileImg?.url
                                ? `${BACKEND_URL}${user.profileImg.url}`
                                : `${BACKEND_URL}/images/profileph.jpg`
                        }
                        alt="profile-img"
                        className="container_headerrow-usrimg"
                    />
                </Link>
                <div>
                    <Link to={`/users/${moment.createdBy.username}`}>
                        <h2>{moment.createdBy.username}</h2>
                    </Link>
                    <p>{moment.location}</p>
                </div>
            </div>
            {user.id === moment.createdBy._id && (
                <FontAwesomeIcon
                    icon={faEllipsis}
                    className="container_headerrow-editbtn"
                    onClick={() => setShowOptions(true)}
                />
            )}
        </div>
    );

    const renderedMenu = (
        <>
            <div className="container_headerrow-options_back"></div>
            <div
                ref={referenceToOptions}
                className="container_headerrow-options"
            >
                <button className="container_headerrow-options_edit">
                    <Link to={`/moments/${moment._id}/edit`}>Edit</Link>
                </button>
                <button
                    className="container_headerrow-options_del"
                    onClick={deleteMoment}
                >
                    Delete
                </button>
                <button
                    className="container_headerrow-options_cancel"
                    onClick={() => setShowOptions(false)}
                >
                    Cancel
                </button>
            </div>
        </>
    );

    return (
        <>
            {renderedHeader}
            {showEdit && renderedMenu}
        </>
    );
};

export default MomentHeadersRow;
