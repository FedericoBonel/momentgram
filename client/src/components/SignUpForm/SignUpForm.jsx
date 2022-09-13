import { Link } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";

import "./SignUpForm.css";
import { registerUser } from "../../api/UsersApi";

const SignUpForm = () => {
    const [signupForm, setSignupForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        birthDate: "",
        submitStatus: "idle",
        warningMessage: "",
    });

    const onChange = (e) => {
        setSignupForm((prevsignupform) => ({
            ...prevsignupform,
            [e.target.name]: e.target.value,
        }));
    };

    const canSubmit = Object.keys(signupForm).every(
        // Warning message is normally empty
        (key) => Boolean(signupForm[key]) || key === "warningMessage"
    );

    const onSubmit = async (e) => {
        e.preventDefault();

        setSignupForm((prevsignupform) => ({
            ...prevsignupform,
            submitStatus: "loading",
        }));

        const result = await registerUser({
            username: signupForm.username,
            firstName: signupForm.firstName,
            lastName: signupForm.lastName,
            email: signupForm.email,
            password: signupForm.password,
            birthDate: signupForm.birthDate.toISOString(),
        });

        if (result.resCode === 201) {
            setSignupForm({
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                password: "",
                birthDate: new Date(),
                submitStatus: "success",
                warningMessage: "",
            });
        } else if (result.resCode === 400) {
            setSignupForm((prevsignupform) => ({
                ...prevsignupform,
                submitStatus: "rejected",
                warningMessage: `Sorry, a user with the same username or email already exists.
                    Please select other username or email.`,
            }));
        } else {
            setSignupForm((prevsignupform) => ({
                ...prevsignupform,
                submitStatus: "error",
                warningMessage: `Sorry, there was an internal error.
                    Please refresh the page and try again`,
            }));
        }
    };

    const renderedForm = (
        <form>
            <input
                value={signupForm.username}
                type="text"
                name="username"
                placeholder="User Name"
                onChange={onChange}
            />
            <input
                value={signupForm.firstName}
                type="text"
                name="firstName"
                placeholder="First Name"
                onChange={onChange}
            />
            <input
                value={signupForm.lastName}
                type="text"
                name="lastName"
                placeholder="Last Name"
                onChange={onChange}
            />
            <DatePicker
                selected={signupForm.birthDate}
                onChange={(date) =>
                    setSignupForm((prevSignUpForm) => ({
                        ...prevSignUpForm,
                        birthDate: date,
                    }))
                }
                className="container_signupform-date"
                placeholderText="Birth Date"
            />
            <input
                value={signupForm.email}
                type="email"
                name="email"
                placeholder="Email"
                onChange={onChange}
            />
            <input
                value={signupForm.password}
                type="password"
                name="password"
                placeholder="Password"
                onChange={onChange}
            />
            <button
                disabled={
                    !canSubmit ||
                    signupForm.submitStatus === "error" ||
                    signupForm.submitStatus === "success"
                }
                className="container_signupform-submit"
                onClick={onSubmit}
            >
                {signupForm.submitStatus === "loading" ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                    "Sign Up"
                )}
            </button>

            {signupForm.submitStatus === "success" && (
                <p>
                    Your account has been registered, please verify your email
                    to login.
                </p>
            )}
            <span className="container_signupform-alert">
                {signupForm.warningMessage}
            </span>
        </form>
    );

    return (
        <section className="container_signupform">
            <h1 className="container_signupform-title">MomentGram</h1>
            <p className="container_signupform-invitation">
                Sign up to see photos and videos from your friends.
            </p>
            {renderedForm}
            <div className="container_signupform-divisor">
                <div>
                    <hr />
                </div>
                <span>Already have an account?</span>
                <div>
                    <hr />
                </div>
            </div>
            <Link to="/">Sign In</Link>
        </section>
    );
};

export default SignUpForm;
