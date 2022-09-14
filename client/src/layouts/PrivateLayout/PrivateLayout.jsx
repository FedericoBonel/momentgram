import { useContext } from "react";
import { Outlet } from "react-router-dom";

import { UserContext } from "../../context/Context";
import { Navbar } from "../../components";

const PrivateLayout = () => {
    const { user } = useContext(UserContext);
    
    return (
        <>
            <Navbar user={user} />
            <Outlet />
        </>
    );
};

export default PrivateLayout;
