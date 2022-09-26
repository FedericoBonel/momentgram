import { useContext } from "react";
import { useParams } from "react-router-dom";

import "./EditMoment.css";
import { UserContext } from "../../context/Context";
import { MomentForm } from "../../components";

const EditMoment = () => {
    const { momentId } = useParams();
    const { user } = useContext(UserContext);

    return (
        <div className="container_editmoment">
            <MomentForm user={user} momentId={momentId} />
        </div>
    );
};

export default EditMoment;
