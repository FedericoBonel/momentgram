import { Link } from "react-router-dom";

import "./UserList.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UserList = ({ users }) => {
    const renderedUsers = users.map((user) => (
        <Link
            to={`/users/${user.username}`}
            key={user._id}
            className="container_users-link"
        >
            <div className="container_users-single_usr">
                <img
                    src={
                        user.profileImg
                            ? `${BACKEND_URL}${user.profileImg.url}`
                            : `${BACKEND_URL}/images/profileph.jpg`
                    }
                    alt="profile-img"
                />
                <p>{user.username}</p>
            </div>
        </Link>
    ));

    return users.length ? (
        <>{renderedUsers}</>
    ) : (
        <p>There are no users to show</p>
    );
};

export default UserList;
