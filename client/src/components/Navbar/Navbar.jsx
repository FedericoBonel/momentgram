import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import "./Navbar.css";
import OutsideClickListener from "../OutsideClickListener/OutsideClickListener";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Navbar = ({ user, onLogout }) => {
    const [showMenu, setShowMenu] = useState("loading"); // loading || show || hidden

    const referenceToMenu = useRef(null);
    OutsideClickListener(referenceToMenu, () => setShowMenu(prev => prev === "loading" ? prev : "hidden"));

    const menu = (
        <ul
            className={`container_popup-menu container_popup-${showMenu}`}
            onClick={() => setShowMenu("hidden")}
        >
            <Link to={`/users/${user.username}`}>
                <li>Profile</li>
            </Link>
            <Link to={`/profile/settings`}>
                <li>Settings</li>
            </Link>
            <li onClick={onLogout} className="container_popup-menulogout">
                Log Out
            </li>
        </ul>
    );

    return (
        <nav className="container_navbar">
            <h1 className="container_navbar-logo">MomentGram</h1>
            <input
                type="search"
                placeholder="Search"
                className="container_navbar-search"
            />
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
                            user.profileImg?.url
                                ? `${BACKEND_URL}${user.profileImg.url}`
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
