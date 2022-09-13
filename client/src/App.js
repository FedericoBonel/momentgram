import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { useState } from "react";

import { UserContext } from "./context/Context";
import "./App.css";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import { Home, SignUp } from "./pages";

function App() {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <UserContext.Provider value={{ user, setUser }}>
                <Routes>
                    {/* Home page */}
                    <Route path="/" element={<Home />} />
                    {/* Private routes */}
                    <Route path="/" element={<PrivateRoute />}>
                        <Route path="/dashboard" />
                        <Route path="/users/:username" />
                    </Route>
                    {/* Public routes */}
                    <Route path="/" element={<PublicRoute />}>
                        <Route path="/register" element={<SignUp />}/>
                        <Route path="/users/verify/:verificationCode"/>
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
