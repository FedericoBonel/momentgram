import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./ProfilePhotoUpdateForm.css";
import Overlay from "../Overlay/Overlay";
import { updateUserProfilePhoto } from "../../api/UsersApi";

const ProfilePhotoUpdateForm = ({ token, validateUser, onClose }) => {
    const navigate = useNavigate();
    const [submitStatus, setSubmitStatus] = useState("idle");

    const inputFile = useRef(null);

    const onChange = async (e) => {
        setSubmitStatus("loading");

        const response = await updateUserProfilePhoto(token, e.target.files[0]);

        if (response.resCode === 201) {
            validateUser({
                token,
                user: {
                    id: response.updatedUser._id,
                    email: response.updatedUser.email,
                    username: response.updatedUser.username,
                    profileImg: response.updatedUser.profileImg,
                },
            });
            setSubmitStatus("idle");
            onClose();
        } else {
            navigate(`/error/${response.resCode}`);
        }
    };

    return (
        <>
            <Overlay onClick={onClose} />
            <div className="profphotoupd_card">
                <h2 className="profphotoupd_card-title">
                    Change Profile Photo
                </h2>
                {submitStatus === "idle" && (
                    <>
                        <form className="profphotoupd_card-form">
                            <input
                                ref={inputFile}
                                type="file"
                                id="profile_photo"
                                onChange={onChange}
                            />
                        </form>
                        <button
                            onClick={() => inputFile.current.click()}
                            className="profphotoupd_card-btn"
                        >
                            Upload photo
                        </button>
                        <button onClick={onClose}>Cancel</button>
                    </>
                )}
                {submitStatus === "loading" && (
                    <FontAwesomeIcon icon={faSpinner} spin />
                )}
            </div>
        </>
    );
};

export default ProfilePhotoUpdateForm;
