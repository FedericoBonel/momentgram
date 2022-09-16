import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";

import "./MomentActionsRow.css";

const MomentActionsRow = () => {
    return (
        <div className="container_actions">
            <button>
                <FontAwesomeIcon icon={faComment} flip="horizontal" />
            </button>
            <button>
                <FontAwesomeIcon icon={faHeart} />
            </button>
        </div>
    );
};

export default MomentActionsRow;
