import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./PasswordUpdateForm.css";
import { updateUserPassword } from "../../api/UsersApi";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PasswordUpdateForm = ({ user, validateUser }) => {
    const navigate = useNavigate();
    const [passwordData, setPasswordData] = useState({
        data: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        submitStatus: "idle",
    });

    const onChange = (e) => {
        setPasswordData((prevData) => ({
            ...prevData,
            data: { ...prevData.data, [e.target.name]: e.target.value },
        }));
    };

    const canSave =
        Boolean(passwordData.data.oldPassword) &&
        Boolean(passwordData.data.newPassword) &&
        passwordData.data.confirmPassword === passwordData.data.newPassword;

    const onSubmit = async (e) => {
        e.preventDefault();

        setPasswordData((prevData) => ({
            ...prevData,
            submitStatus: "loading",
        }));

        const { data, resCode } = await updateUserPassword(
            user.token,
            passwordData.data
        );

        if (resCode === 200) {
            validateUser({ token: data.token, user: data.user });
            
            setPasswordData({
                data: {
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                },
                submitStatus: "success",
            });
        } else if (resCode === 401) {
            setPasswordData((prevData) => ({
                ...prevData,
                submitStatus: "rejected",
            }));
        } else {
            navigate(`/error/${resCode}`);
        }
    };

    return (
        <div className="container_passupd">
            <div className="container_passupd-usrrow">
                <img
                    className="container_passupd-profimg"
                    src={
                        user.user.profileImg
                            ? `${BACKEND_URL}${user.user.profileImg.url}`
                            : `${BACKEND_URL}/images/profileph.jpg`
                    }
                    alt="profile-img"
                />
                <div>
                    <p>{user.user.username}</p>
                </div>
            </div>

            <form className="container_passupd-form" onSubmit={onSubmit}>
                <div className="container_passupd-form_input">
                    <aside>
                        <label htmlFor="oldPassword">Old Password</label>
                    </aside>
                    <div className="container_passupd-form_input-r">
                        <input
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            onChange={onChange}
                            value={passwordData.data.oldPassword}
                        />
                    </div>
                </div>
                <div className="container_passupd-form_input">
                    <aside>
                        <label htmlFor="newPassword">New Password</label>
                    </aside>
                    <div className="container_passupd-form_input-r">
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            onChange={onChange}
                            value={passwordData.data.newPassword}
                        />
                    </div>
                </div>
                <div className="container_passupd-form_input">
                    <aside>
                        <label htmlFor="confirmPassword">
                            Confirm New Password
                        </label>
                    </aside>
                    <div className="container_passupd-form_input-r">
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            onChange={onChange}
                            value={passwordData.data.confirmPassword}
                        />
                    </div>
                </div>
                <button
                    className="container_passupd-form_submit"
                    disabled={!canSave}
                >
                    Submit
                </button>
                {passwordData.submitStatus === "success" && (
                    <p className="container_passupd-form_suc">
                        Hooray! Your password was saved successfully.
                    </p>
                )}
                {passwordData.submitStatus === "rejected" && (
                    <p className="container_passupd-form_alert">
                        Sorry, your password was incorrect, please try again.
                    </p>
                )}
            </form>
        </div>
    );
};

export default PasswordUpdateForm;
