import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./UserUpdateForm.css";
import { getUserByUsername, updateUserInfo } from "../../api/UsersApi";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UserUpdateForm = ({ user }) => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        data: {
            firstName: "",
            lastName: "",
            username: user.username,
            description: "",
        },
        submitStatus: "loading",
    });

    useEffect(() => {
        const fetchUser = async () => {
            const fetchedUsers = await getUserByUsername(
                user.token,
                user.user.username
            );

            if (fetchedUsers.resCode === 200) {
                setUserInfo({
                    data: fetchedUsers.user,
                    submitStatus: "idle",
                });
            } else {
                navigate(`/error/${fetchedUsers.resCode}`);
            }
        };

        fetchUser();
    }, [user, navigate]);

    const onChange = (e) => {
        setUserInfo((prevInfo) => ({
            ...prevInfo,
            data: { ...prevInfo.data, [e.target.name]: e.target.value },
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const updateRes = await updateUserInfo(user.token, userInfo.data);

        if (updateRes.resCode === 200) {
            setUserInfo({
                submitStatus: "idle",
                data: updateRes.updatedUser,
            });
        } else {
            navigate(`/error/${updateRes.resCode}`);
        }
    };

    return (
        <div className="container_usrupd-form">
            <div className="container_usrupd-form_usrrow">
                <img
                    className="container_usrupd-form_profimg"
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
            <form className="container_usrupd-form_form" onSubmit={onSubmit}>
                <div className="container_usrupd-usr_input">
                    <aside>
                        <label htmlFor="firstName">First Name</label>
                    </aside>
                    <div className="container_usrup-usr_input-r">
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={userInfo.data.firstName}
                            onChange={onChange}
                        />
                        <small>
                            Help people discover your account by using the name
                            you're known by: either your full first name,
                            nickname, or business name.
                        </small>
                    </div>
                </div>
                <div className="container_usrupd-usr_input">
                    <aside>
                        <label htmlFor="lastName">Last Name</label>
                    </aside>
                    <div className="container_usrup-usr_input-r">
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={userInfo.data.lastName}
                            onChange={onChange}
                        />
                        <small>
                            Help people discover your account by using the name
                            you're known by: either your full last name or
                            business name.
                        </small>
                    </div>
                </div>
                <div className="container_usrupd-usr_input">
                    <aside>
                        <label htmlFor="username">Username</label>
                    </aside>
                    <div className="container_usrup-usr_input-r">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={userInfo.data.username}
                            onChange={onChange}
                        />
                        <small>
                            This username will be displayed on your profile and
                            posts.
                        </small>
                    </div>
                </div>
                <div className="container_usrupd-usr_input">
                    <aside>
                        <label htmlFor="description">Profile Description</label>
                    </aside>
                    <div className="container_usrup-usr_input-r">
                        <textarea
                            id="description"
                            name="description"
                            value={userInfo.data.description}
                            onChange={onChange}
                        />
                        <small>
                            Add a description of your profile so users know what
                            you post about.
                        </small>
                    </div>
                </div>
                <button className="container_usrup-form_submit">Submit</button>
            </form>
        </div>
    );
};

export default UserUpdateForm;
