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
import ScrollToTop from "./routes/ScrollToTop";
import {
    Home,
    SignUp,
    VerifyAccount,
    Dashboard,
    MomentPage,
    NewMoment,
    UserProfile,
    UserSettings,
    Error,
    EditMoment,
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
            <ScrollToTop />
            <UserContext.Provider
                value={{ user, validateUser, invalidateUser }}
            >
                <Routes>
                    {/* Home page */}
                    <Route path="/" element={<Home />} />
                    {/* Private routes */}
                    <Route path="/" element={<PrivateRoute />}>
                        <Route element={<PrivateLayout />}>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="moments">
                                <Route path="create" element={<NewMoment />} />
                                <Route
                                    path=":momentId"
                                    element={<MomentPage />}
                                />
                                <Route
                                    path=":momentId/edit"
                                    element={<EditMoment />}
                                />
                            </Route>
                            <Route
                                path="users/:username"
                                element={<UserProfile />}
                            />
                            <Route
                                path="profile/settings"
                                element={<UserSettings />}
                            />
                        </Route>
                    </Route>
                    {/* Public routes */}
                    <Route path="/" element={<PublicRoute />}>
                        <Route element={<PublicLayout />}>
                            <Route path="register" element={<SignUp />} />
                            <Route
                                path="users/verify/:verificationCode"
                                element={<VerifyAccount />}
                            />
                        </Route>
                    </Route>
                    {/* Errors */}
                    <Route path="/error/:code" element={<Error />} />
                    <Route path="*" element={<Navigate to="/error/404" />} />
                </Routes>
            </UserContext.Provider>
        </Router>
    );
}

export default App;
