import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

import "./MomentHeadersRow.css";

const MomentHeadersRow = ({ moment }) => {
    return (
        <div className="container_headerrow">
            <Link to={`/users/${moment.createdBy.username}`}>
                <FontAwesomeIcon
                    icon={faUserCircle}
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
    );
};

export default MomentHeadersRow;
