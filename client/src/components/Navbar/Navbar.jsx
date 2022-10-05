import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faPlus,
    faSpinner,
    faGear,
    faUserAlt,
    faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.css";
import OutsideClickListener from "../OutsideClickListener/OutsideClickListener";
import { getUsersByUsernameLike } from "../../api/UsersApi";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState("loading"); // loading || show || hidden

    const [searchRes, setSearchRes] = useState({
        submitStatus: "idle",
        data: [],
    });
    const [searchInput, setSearchInput] = useState("");

    const hideSearch = () => {
        setSearchRes({
            submitStatus: "idle",
            data: [],
        });
        setSearchInput("");
    };

    const referenceToMenu = useRef(null);
    OutsideClickListener(referenceToMenu, () =>
        setShowMenu((prev) => (prev === "loading" ? prev : "hidden"))
    );

    const referenceToRes = useRef(null);
    OutsideClickListener(referenceToRes, hideSearch);

    const onSearchChange = async (e) => {
        setSearchInput(e.target.value);

        if (e.target.value.length < 1) {
            hideSearch();
            return;
        }

        setSearchRes((prevRes) => ({
            submitStatus: "loading",
            data: [...prevRes.data],
        }));

        const foundUsers = await getUsersByUsernameLike(
            user.token,
            e.target.value
        );

        if (foundUsers.resCode === 200) {
            setSearchRes({
                submitStatus: "idle",
                data: foundUsers.userList,
            });
        } else {
            navigate(`/error/${foundUsers.resCode}`);
        }
    };

    const menu = (
        <ul
            className={`container_popup-menu container_popup-${showMenu}`}
            onClick={() => setShowMenu("hidden")}
        >
            <Link to={`/users/${user.user.username}`}>
                <li>{<FontAwesomeIcon icon={faUserAlt} />} Profile</li>
            </Link>
            <Link to={`/profile/settings`}>
                <li>{<FontAwesomeIcon icon={faGear} />} Settings</li>
            </Link>
            <li onClick={onLogout} className="container_popup-menulogout">
                {<FontAwesomeIcon icon={faSignOut} />} Log Out
            </li>
        </ul>
    );

    const searchResList = (
        <div className="container_navbar-search_res">
            {searchRes.submitStatus === "loading" && (
                <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    className="container_navbar-search_res-spinner"
                />
            )}
            {searchRes.data.map((foundUser) => (
                <Link
                    to={`/users/${foundUser.username}`}
                    className="container_navbar-search_resusr"
                    onClick={hideSearch}
                    key={foundUser._id}
                >
                    <img
                        src={`${BACKEND_URL}${foundUser.profileImg.url}`}
                        alt="found-user-profile-img"
                    />
                    <div className="container_navbar-search_resusr-data">
                        <p>{foundUser.username}</p>
                        <small>{foundUser.firstName}</small>
                    </div>
                </Link>
            ))}
        </div>
    );

    return (
        <nav className="container_navbar">
            <h1 className="container_navbar-logo">MomentGram</h1>
            <div className="container_navbar-search" ref={referenceToRes}>
                <input
                    type="search"
                    placeholder="Search"
                    className="container_navbar-search"
                    onChange={onSearchChange}
                    value={searchInput}
                    onSubmit={(e) => e.preventDefault()}
                />
                {searchRes.data.length > 0 && searchResList}
            </div>
            <ul className="container_navbar-links">
                <li className="container_navbar-link_clickable">
                    <Link to="/dashboard">
                        <FontAwesomeIcon icon={faHome} />
                    </Link>
                </li>
                <li className="container_navbar-link_clickable">
                    <Link to="/moments/create">
                        <div className="container_navbar-addbtn">
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                    </Link>
                </li>
                <li className="container_navbar-menu" ref={referenceToMenu}>
                    <img
                        src={
                            user.user.profileImg?.url
                                ? `${BACKEND_URL}${user.user.profileImg.url}`
                                : `${BACKEND_URL}/images/profileph.jpg`
                        }
                        alt="profile-img"
                        className="container_navbar-profimg container_navbar-link_clickable"
                        onClick={() =>
                            setShowMenu((prevShow) =>
                                prevShow === "show" ? "hidden" : "show"
                            )
                        }
                    />
                    {menu}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
