import { useParams, Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/Context";

import "./Error.css";

const Error = () => {
    const { code } = useParams();
    const { invalidateUser } = useContext(UserContext);

    const codeNumber = Number(code);

    if (codeNumber === 401) {
        invalidateUser();
    }

    const errorMessage = (codeNumber) => {
        if (codeNumber === 400) {
            return <h2>There was a problem with your request.</h2>;
        } else if (codeNumber === 401) {
            return (
                <>
                    <h2>Oups it seems your keys have been revoked.</h2>
                    <p>
                        please continue to <Link to="/">log in</Link>.
                    </p>
                </>
            );
        } else if (codeNumber === 404) {
            return (
                <>
                    <h2>Sorry this page isn't available.</h2>
                    <p>
                        The link you followed may be broken, or the page may
                        have been removed.
                    </p>
                </>
            );
        } else {
            return <h2>An error ocurred.</h2>;
        }
    };

    const renderedContent = (
        <main className="container_error">
            {errorMessage(codeNumber)}
            <Link to="/dashboard">Go back to MomentGram</Link>.
        </main>
    );

    return <div>{renderedContent}</div>;
};

export default Error;
