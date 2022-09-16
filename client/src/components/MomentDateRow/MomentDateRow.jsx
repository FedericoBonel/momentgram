import "./MomentDateRow.css";
import { getDaysAgoFrom } from "../../api/DateApi";

const MomentDateRow = ({dateString}) => {
    const madeAgo = getDaysAgoFrom(dateString);
    return (
        <p className="container_daterow">
            {madeAgo > 0 ? `${madeAgo} DAY${madeAgo > 1 && "S"} AGO` : "TODAY"}
        </p>
    );
};

export default MomentDateRow;
