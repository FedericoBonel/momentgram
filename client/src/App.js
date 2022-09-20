import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { useState } from "react";
import cookies from "js-cookie";

import { UserContext } from "./context/Context";
import "./App.css";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import {
    Home,
    SignUp,
    VerifyAccount,
    Dashboard,
    MomentPage,
    NewMoment,
} from "./pages";
import { PrivateLayout, PublicLayout } from "./layouts";

const savedCookie = cookies.get("user");

function App() {
    const [user, setUser] = useState(
        savedCookie ? JSON.parse(savedCookie) : null
    );

    const validateUser = (user) => {
        cookies.set("user", JSON.stringify(user), { expires: 7 });
        setUser(user);
    };

    const invalidateUser = () => {
        cookies.remove("user");
        setUser();
    };

    return (
        <Router>
            <UserContext.Provider
                value={{ user, validateUser, invalidateUser }}
            >
                <Routes>
                    {/* Home page */}
                    <Route path="/" element={<Home />} />
                    {/* Private routes */}
                    <Route element={<PrivateRoute />}>
                        <Route element={<PrivateLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route
                                path="/moments/create"
                                element={<NewMoment />}
                            />
                            <Route
                                path="/moments/:momentId"
                                element={<MomentPage />}
                            />
                            <Route path="/moments/:momentId/likes" />
                            <Route path="/users/:username" />
                        </Route>
                    </Route>
                    {/* Public routes */}
                    <Route element={<PublicRoute />}>
                        <Route element={<PublicLayout />}>
                            <Route path="/register" element={<SignUp />} />
                            <Route
                                path="/users/verify/:verificationCode"
                                element={<VerifyAccount />}
                            />
                        </Route>
                    </Route>
                    {/* Errors */}
                    <Route path="/error/:code" />
                    <Route path="*" element={<Navigate to="/error/404" />} />
                </Routes>
            </UserContext.Provider>
        </Router>
    );
}

export default App;
