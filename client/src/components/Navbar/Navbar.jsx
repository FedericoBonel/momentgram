import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faPlus,
    faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="container_navbar">
            <h1 className="container_navbar-logo">MomentGram</h1>
            <input
                type="search"
                placeholder="Search"
                className="container_navbar-search"
            />
            <ul className="container_navbar-links">
                <li>
                    <Link to="/dashboard">
                        <FontAwesomeIcon icon={faHome} />
                    </Link>
                </li>
                <li>
                    <Link to="/moments/create">
                        <div className="container_navbar-addbtn">
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                    </Link>
                </li>
                <li>
                    <div>
                        <FontAwesomeIcon icon={faUserCircle} />
                    </div>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
