import { useContext } from "react";

import "./NewMoment.css";
import { UserContext } from "../../context/Context";
import { MomentForm } from "../../components";

const NewMoment = () => {
    const { user } = useContext(UserContext);
    return (
        <div className="container_newmoment">
            <MomentForm user={user} />
        </div>
    );
};

export default NewMoment;
