import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";

import { UserContext } from "../context/Context";

const PrivateRoute = () => {
    const { user } = useContext(UserContext);

    return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
