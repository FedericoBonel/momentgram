import { Link } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./LoginForm.css";
import { authenticateUser } from "../../api/UsersApi";

const LoginForm = ({ setUser }) => {
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
        submitStatus: "idle",
        warningMessage: "",
    });

    const onChange = (e) => {
        setLoginForm((prevLoginForm) => ({
            ...prevLoginForm,
            [e.target.name]: e.target.value,
        }));
    };

    const canSubmit = Boolean(loginForm.email) && Boolean(loginForm.password);

    const onSubmit = async (e) => {
        e.preventDefault();

        setLoginForm((prevLoginForm) => ({
            ...prevLoginForm,
            submitStatus: "loading",
        }));

        const result = await authenticateUser({
            email: loginForm.email,
            password: loginForm.password,
        });

        if (result.resCode === 200) {
            setUser({ token: result.token, user: result.user });

            setLoginForm({
                email: "",
                password: "",
                submitStatus: "idle",
                warningMessage: "",
            });
        } else if (result.resCode === 401 || result.resCode === 400) {
            setLoginForm((prevLoginForm) => ({
                ...prevLoginForm,
                submitStatus: "rejected",
                warningMessage: `Sorry, your password or email was incorrect. 
                    Please double-check your password and email.`,
            }));
        } else {
            setLoginForm((prevLoginForm) => ({
                ...prevLoginForm,
                submitStatus: "error",
                warningMessage: `Sorry, there was an internal error.
                    Please refresh the page and try again`,
            }));
        }
    };

    const renderedForm = (
        <form>
            <input
                value={loginForm.email}
                type="email"
                name="email"
                placeholder="Email"
                onChange={onChange}
            />
            <input
                value={loginForm.password}
                type="password"
                name="password"
                placeholder="Password"
                onChange={onChange}
            />
            <button
                disabled={
                    !canSubmit ||
                    loginForm.submitStatus === "loading" ||
                    loginForm.submitStatus === "error"
                }
                className="container_loginform-submit"
                onClick={onSubmit}
            >
                {loginForm.submitStatus === "loading" ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                    "Log In"
                )}
            </button>
            <span className="container_loginform-alert">
                {loginForm.warningMessage}
            </span>
        </form>
    );

    return (
        <section className="container_loginform">
            <h1 className="container_loginform-title">MomentGram</h1>
            {renderedForm}
            <div className="container_loginform-divisor">
                <div>
                    <hr />
                </div>
                <span>Don't have an account?</span>
                <div>
                    <hr />
                </div>
            </div>
            <Link to="/register">Sign up</Link>
        </section>
    );
};

export default LoginForm;
