import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

import "./MomentHeadersRow.css";

const MomentHeadersRow = ({moment}) => {
    return (
        <div className="container_headerrow">
            <FontAwesomeIcon
                icon={faUserCircle}
                className="container_headerrow-usrimg"
            />
            <div>
                <h2>{moment.createdBy.username}</h2>
                <p>{moment.location}</p>
            </div>
        </div>
    );
};

export default MomentHeadersRow;
