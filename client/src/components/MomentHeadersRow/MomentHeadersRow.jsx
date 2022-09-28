import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

import "./MomentHeadersRow.css";
import Overlay from "../Overlay/Overlay";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MomentHeadersRow = ({ moment, user, onDelete }) => {
    const navigate = useNavigate();
    const [showEdit, setShowEdit] = useState();

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

    const editMoment = () => {
        setShowOptions(false);
        navigate(`/moments/${moment._id}/edit`);
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
            <Overlay onClick={() => setShowOptions(false)}/>
            <div
                className="container_headerrow-options"
            >
                <button
                    className="container_headerrow-options_edit"
                    onClick={editMoment}
                >
                    Edit
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
