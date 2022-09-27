import { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./Dashboard.css";
import {
    getMomentsFor,
    likeMoment,
    disLikeMoment,
    deleteMomentById,
} from "../../api/MomentsApi";
import { UserContext } from "../../context/Context";
import { Moment } from "../../components";

const Dashboard = () => {
    const navigate = useNavigate();

    const { user } = useContext(UserContext);

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
            } else {
                navigate(`/error/${serverMoments.resCode}`);
            }
        };

        loadMoments();
    }, [user, navigate, page]);

    const onLikeMoment = useCallback(
        async (momentId, isLiked) => {
            const { resCode } = isLiked
                ? await disLikeMoment(user.token, momentId)
                : await likeMoment(user.token, momentId);

            if (resCode === 201 || resCode === 200) {
                setMoments((prevMoments) => ({
                    ...prevMoments,
                    data: prevMoments.data.map((moment) => {
                        if (moment._id === momentId) {
                            return { ...moment, isLiked: !moment.isLiked };
                        }
                        return moment;
                    }),
                }));
            } else {
                navigate(`/error/${resCode}`);
            }
        },
        [user.token, navigate]
    );

    const onDeleteMoment = useCallback(async (momentId) => {
        const { resCode } = await deleteMomentById(user.token, momentId);

        if (resCode === 200) {
            setMoments((prevMoments) => ({
                ...prevMoments,
                data: prevMoments.data.filter(
                    (moment) => moment._id !== momentId
                ),
            }));
        } else {
            navigate(`/error/${resCode}`);
        }
    }, [user.token, navigate]);

    const renderedMoments = moments.data.map((moment) => (
        <Moment
            moment={moment}
            key={moment._id}
            user={user}
            onLikeMoment={onLikeMoment}
            onDelete={onDeleteMoment}
        />
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
