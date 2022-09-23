import { useContext, useState } from "react";

import "./UserSettings.css";
import { UserContext } from "../../context/Context";
import { UserUpdateForm, PasswordUpdateForm } from "../../components";

const UserSettings = () => {
    const { user } = useContext(UserContext);
    const [menuToDisplay, setMenuToDisplay] = useState("userinfo"); // "password" || "userinfo"

    return (
        <main className="container_usrsettings">
            <div className="container_usrsettings-card">
                <ul className="container_usrsettings-links">
                    <li>Edit profile</li>
                    <li>Change password</li>
                </ul>
                <div className="container_usrsettings-form">
                    {menuToDisplay === "userinfo" && <UserUpdateForm user={user}/>}
                    {menuToDisplay === "password" && <PasswordUpdateForm />}
                </div>
            </div>
        </main>
    );
};

export default UserSettings;
