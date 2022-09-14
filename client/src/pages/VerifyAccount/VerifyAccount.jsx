import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./VerifyAccount.css";
import emailLogo from "../../assets/images/email.png";
import { verifyAccount } from "../../api/UsersApi";
import mgLogo from "../../assets/images/MomentGramLogo.png";

const VerifyAccount = () => {
    const [verification, setVerification] = useState("loading");
    const { verificationCode } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const doVerification = async () => {
            const response = await verifyAccount(verificationCode);

            if (response.resCode === 200) {
                setVerification("success");
            } else if (response.resCode === 404) {
                navigate("/error/404");
            } else {
                navigate("/error/500");
            }
        };

        doVerification();
    }, [verificationCode, navigate]);

    const successCard = (
        <div className="container_verification-card">
            <img
                className="container_verification-logo"
                src={emailLogo}
                alt="email-logo"
            />
            <h1 className="container_verification-cardtitle">
                Your account has been verified
            </h1>
            <p>
                Please continue to <Link to="/">sing in</Link> to access your
                new account.
            </p>
        </div>
    );

    return (
        <main className="container_verification">
            {verification === "loading" && (
                <div className="container_verification-loading">
                    <img
                        className="container_verification-loadinglogo"
                        src={mgLogo}
                        alt="loading-logo"
                    />
                    <FontAwesomeIcon icon={faSpinner} spin size="2x"/>
                </div>
            )}
            {verification === "success" && successCard}
        </main>
    );
};

export default VerifyAccount;
