import { useState } from "react";

import "./PasswordUpdateForm.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PasswordUpdateForm = ({ user }) => {
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

        // Todo implement this
    };

    return (
        <div className="container_passupd">
            <div className="container_passupd-usrrow">
                <img
                    className="container_passupd-profimg"
                    src={
                        user.user.profileImg
                            ? `${BACKEND_URL}/images/${user.profileImg.url}`
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
            </form>
        </div>
    );
};

export default PasswordUpdateForm;
