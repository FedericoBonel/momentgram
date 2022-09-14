import { Outlet } from "react-router-dom";

const PublicLayout = () => {
    return (
        <>
            <Outlet />
            {/* TODO create footer */}
        </>
    );
};

export default PublicLayout;
