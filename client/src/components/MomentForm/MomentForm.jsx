import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserCircle,
    faFileAlt,
    faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

import "./MomentForm.css";
import { createMoment } from "../../api/MomentsApi";

const MomentForm = ({ user }) => {
    const navigate = useNavigate();
    const [newMoment, setNewMoment] = useState({
        data: {},
        submitStatus: "idle",
    });

    const onChange = (e) => {
        setNewMoment((prevMoment) => ({
            ...prevMoment,
            data: {
                ...prevMoment.data,
                [e.target.name]:
                    e.target.name === "images"
                        ? e.target.files[0]
                        : e.target.value,
            },
        }));
    };

    const canUpload =
        Boolean(newMoment.data.location) && Boolean(newMoment.data.images);

    const onSubmit = async (e) => {
        e.preventDefault();

        const response = await createMoment(user.token, newMoment.data);

        if (response.resCode === 201) {
            navigate(`/moments/${response.moment._id}`);
        } else {
            console.log(`An error ocurred during upload`);
            navigate(`/error/${response.resCode}`);
        }
    };

    return (
        <form className="container_momentform-card" onSubmit={onSubmit}>
            <div className="container_momentform-cardcontrol">
                <p>Create New Post</p>
                <button disabled={!canUpload}>Share</button>
            </div>
            <div className="container_momentform">
                <div className="container_momentform-fileinp">
                    <input
                        type="file"
                        name="images"
                        id="images"
                        accept="images/*"
                        onChange={onChange}
                    />

                    {newMoment.data.images ? (
                        <img
                            src={`${URL.createObjectURL(
                                newMoment.data.images
                            )}`}
                            alt="loaded-img"
                            className="container_momentform-preview"
                        />
                    ) : (
                        <>
                            <FontAwesomeIcon
                                icon={faFileAlt}
                                className="container_momentform-fileinpic"
                            />
                            <h2>Drag photos here</h2>
                        </>
                    )}
                </div>
                <div className="container_momentform-right">
                    <div className="container_momentform-usr">
                        <FontAwesomeIcon
                            icon={faUserCircle}
                            className="container_momentform-usricon"
                        />
                        <p>{user.user.username}</p>
                    </div>
                    <textarea
                        name="description"
                        placeholder="Write a description..."
                        maxLength={256}
                        value={newMoment.data.description}
                        onChange={onChange}
                        className="container_momentform-descinp"
                    />
                    <div className="container_momentform-locinp">
                        <input
                            type="text"
                            name="location"
                            id="location"
                            onChange={onChange}
                            placeholder="Add a location..."
                        />
                        <FontAwesomeIcon
                            icon={faMapMarkerAlt}
                            className="container_momentform-locinpimg"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};

export default MomentForm;
