import { useContext, useState } from "react";

import "./UserSettings.css";
import { UserContext } from "../../context/Context";
import { UserUpdateForm, PasswordUpdateForm } from "../../components";

const UserSettings = () => {
    const { user, validateUser } = useContext(UserContext);
    const [menuToDisplay, setMenuToDisplay] = useState("userinfo"); // "password" || "userinfo"

    return (
        <main className="container_usrsettings">
            <div className="container_usrsettings-card">
                <ul className="container_usrsettings-links">
                    <li
                        onClick={() => setMenuToDisplay("userinfo")}
                        className={`container_usrsettings-link
                            ${
                                menuToDisplay === "userinfo" &&
                                `container_usrsettings-selected`
                            }
                        `}
                    >
                        Edit profile
                    </li>
                    <li
                        onClick={() => setMenuToDisplay("password")}
                        className={`container_usrsettings-link
                            ${
                                menuToDisplay === "password" &&
                                `container_usrsettings-selected`
                            }
                        `}
                    >
                        Change password
                    </li>
                </ul>
                <div className="container_usrsettings-form">
                    {menuToDisplay === "userinfo" && (
                        <UserUpdateForm user={user} validateUser={validateUser}/>
                    )}
                    {menuToDisplay === "password" && (
                        <PasswordUpdateForm user={user} validateUser={validateUser}/>
                    )}
                </div>
            </div>
        </main>
    );
};

export default UserSettings;
