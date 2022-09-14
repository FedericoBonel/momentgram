import { Navigate } from "react-router-dom";
import { useContext } from "react";

import "./Home.css";
import MomentGramLogo from "../../assets/images/MomentGramLogo.png";
import { LoginForm } from "../../components";
import { UserContext } from "../../context/Context";

const Home = () => {
    const { user, validateUser } = useContext(UserContext);

    return (
        <>
            {user && <Navigate to="/dashboard" />}
            <main className="container_home">
                <img
                    className="container_home-heroimg"
                    src={MomentGramLogo}
                    alt="momentgram-logo"
                />
                <LoginForm setUser={validateUser}/>
            </main>
        </>
    );
};

export default Home;
