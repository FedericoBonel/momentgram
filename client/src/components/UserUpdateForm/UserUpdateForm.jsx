import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./UserUpdateForm.css";
import ProfilePhotoUpdateForm from "../ProfilePhotoUpdateForm/ProfilePhotoUpdateForm";
import { getUserByUsername, updateUserInfo } from "../../api/UsersApi";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UserUpdateForm = ({ user, validateUser }) => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        data: {
            firstName: "",
            lastName: "",
            username: "",
            description: "",
        },
        submitStatus: "loading",
    });
    const [showProfilePhotoForm, setShowProfilePhotoForm] = useState(false);

    const canSave =
        Boolean(userInfo.data.firstName) &&
        Boolean(userInfo.data.lastName) &&
        Boolean(userInfo.data.username) &&
        Boolean(userInfo.submitStatus !== "loading");

    useEffect(() => {
        const fetchUser = async () => {
            const fetchedUser = await getUserByUsername(
                user.token,
                user.user.username
            );

            if (fetchedUser.resCode === 200) {
                setUserInfo({
                    data: fetchedUser.user,
                    submitStatus: "idle",
                });
            } else {
                navigate(`/error/${fetchedUser.resCode}`);
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
        setUserInfo((prevInfo) => ({
            ...prevInfo,
            submitStatus: "submitting",
        }));

        const updateRes = await updateUserInfo(user.token, userInfo.data);

        if (updateRes.resCode === 200) {
            setUserInfo({
                submitStatus: "idle",
                data: updateRes.updatedUser,
            });
            validateUser({
                token: user.token,
                user: {
                    id: updateRes.updatedUser._id,
                    email: updateRes.updatedUser.email,
                    username: updateRes.updatedUser.username,
                    profileImg: updateRes.updatedUser.profileImg,
                },
            });
        } else {
            navigate(`/error/${updateRes.resCode}`);
        }
    };

    const renderedForm = (
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
                        you're known by: either your full first name, nickname,
                        or business name.
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
                        you're known by: either your full last name or business
                        name.
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
                        maxLength="250"
                    />
                    <small>
                        Add a description of your profile so users know what you
                        post about.
                    </small>
                </div>
            </div>
            <button className="container_usrup-form_submit" disabled={!canSave}>
                Submit{" "}
                {userInfo.submitStatus === "submitting" && (
                    <FontAwesomeIcon icon={faSpinner} spin />
                )}
            </button>
        </form>
    );

    return (
        <div className="container_usrupd-form">
            <div className="container_usrupd-form_usrrow">
                <img
                    className="container_usrupd-form_profimg"
                    src={
                        user.user.profileImg
                            ? `${BACKEND_URL}${user.user.profileImg.url}`
                            : `${BACKEND_URL}/images/profileph.jpg`
                    }
                    alt="profile-img"
                />
                <div className="container_usrupd-form_usrdata">
                    <p className="container_usrupd-form_usrdataname">
                        {user.user.username}
                    </p>
                    <p
                        className="container_usrupd-form_usrdatabtn"
                        onClick={() => setShowProfilePhotoForm(true)}
                    >
                        Change profile photo
                    </p>
                </div>
            </div>
            {showProfilePhotoForm && (
                <ProfilePhotoUpdateForm
                    onClose={() => setShowProfilePhotoForm(false)}
                    token={user.token}
                    validateUser={validateUser}
                />
            )}
            {userInfo.submitStatus === "loading" && (
                <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    size={"2x"}
                    color="gray"
                />
            )}
            {userInfo.submitStatus !== "loading" && renderedForm}
        </div>
    );
};

export default UserUpdateForm;
