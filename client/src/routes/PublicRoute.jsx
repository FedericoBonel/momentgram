import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";

import { UserContext } from "../context/Context";

const PublicRoute = () => {
    const { user } = useContext(UserContext);

    return user ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
