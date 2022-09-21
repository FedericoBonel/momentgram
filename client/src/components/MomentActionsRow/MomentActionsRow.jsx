import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";

import "./MomentActionsRow.css";

const MomentActionsRow = ({ isLiked, onLike }) => {
    return (
        <div className="container_actions">
            <button>
                <FontAwesomeIcon icon={faComment} flip="horizontal" />
            </button>
            <button onClick={onLike}>
                <FontAwesomeIcon
                    icon={faHeart}
                    className={`${
                        isLiked ? "fa-beat container_actions-animation" : ""
                    }`}
                />
            </button>
        </div>
    );
};

export default MomentActionsRow;
