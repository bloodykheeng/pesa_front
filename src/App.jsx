import React, { Suspense } from "react";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";

import useAuthContext from "./context/AuthContext";

import PrivateAdmin from "./components/auth/PrivateAdmin";

// const NewLoginPage = React.lazy(() => import("./components/auth/NewLoginPage"));
// import NewLoginPage from "./components/auth/NewLoginPage";
import LoginPage from "./views/Auth/LoginPage";
import ResetPasswordPage from "./views/Auth/ResetPasswordPage";
import SignUpPage from "./views/Auth/SignUpPage";

function App() {
    const { user, getUserQuery, isLoading } = useAuthContext();
    return (
        <>
            {/* <Suspense fallback={<div>Loading...</div>}> */}
            <Routes>
                <Route path="/login" element={getUserQuery?.data?.data ? <Navigate to="/dashboard" /> : <LoginPage />} />
                <Route path="/sign-up" element={getUserQuery?.data?.data ? <Navigate to="/dashboard" /> : <SignUpPage />} />
                <Route path="/reset-password" element={getUserQuery?.data?.data ? <Navigate to="/dashboard" /> : <ResetPasswordPage />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/*" element={<PrivateAdmin />} />
                <Route
                    path="*"
                    element={
                        <div>
                            <h1>Page Not Found</h1>
                        </div>
                    }
                />
                {/* <Route path="*" element={<Navigate to="/login" />} /> */}
            </Routes>
            {/* </Suspense> */}
        </>
    );
}

export default App;
