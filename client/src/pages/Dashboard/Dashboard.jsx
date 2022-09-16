import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./Dashboard.css";
import { getMomentsFor } from "../../api/MomentsApi";
import { UserContext } from "../../context/Context";
import { Moment } from "../../components";

const Dashboard = () => {
    const navigate = useNavigate();

    const { user, invalidateUser } = useContext(UserContext);

    const [moments, setMoments] = useState({
        data: [],
        submitStatus: "loading",
    });
    const [page, setPage] = useState(1);
    const [disableMore, setDisableMore] = useState(false);

    useEffect(() => {
        const loadMoments = async () => {
            setMoments((prevMoments) => ({
                ...prevMoments,
                submitStatus: "loading",
            }));

            const serverMoments = await getMomentsFor(user.token, page);

            if (serverMoments.resCode === 200) {
                if (serverMoments.moments.length === 0) {
                    setDisableMore(true);
                    setMoments((prevMoments) => ({
                        ...prevMoments,
                        submitStatus: "success",
                    }));
                } else {
                    setMoments((prevMoments) => ({
                        data: [...prevMoments.data, ...serverMoments.moments],
                        submitStatus: "success",
                    }));
                }
            } else if (serverMoments.resCode === 401) {
                invalidateUser();
            } else {
                navigate("/error/500");
            }
        };

        loadMoments();
    }, [user, invalidateUser, navigate, page]);

    const renderedMoments = moments.data.map((moment) => (
        <Moment moment={moment} key={moment._id} token={user.token}/>
    ));

    const renderedLoadBtn = !disableMore ? (
        <button
            className="container_dashboard-loadbtn"
            onClick={() => setPage((prevPage) => prevPage + 1)}
        >
            Load more
        </button>
    ) : (
        <p>You've reached the end of your feed!</p>
    );

    return (
        <main className="container_dashboard">
            {renderedMoments}
            {moments.submitStatus === "loading" ? (
                <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    className="container_dashboard-load"
                    size="2x"
                />
            ) : (
                renderedLoadBtn
            )}
        </main>
    );
};

export default Dashboard;
