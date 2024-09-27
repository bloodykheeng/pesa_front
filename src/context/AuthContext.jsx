import { createContext, useContext, useState, useEffect, useMemo } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getUserService, getCsrf } from "../services/auth/auth.js";
import axios from "axios";
import { logout } from "../services/auth/auth-api";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();
    const [errors, setErrors] = useState([]);
    const [logoutMutationIsLoading, setLogoutMutationIsLoading] = useState(false);

    const location = useLocation();

    const navigate = useNavigate();
    console.log("location.pathname : ", location.pathname);

    // const getCsrfToken = useQuery(["csrftoken"], getCsrf, {
    //     retry: false,
    //     onSuccess: (data) => {},
    //     onError: (error) => {
    //         console.log("error while getting csrf token : ", error);
    //     },
    // });

    // The signal is an instance of the AbortSignal interface provided by tanstack,
    // which is used to communicate with a AbortController to signal that an operation should be aborted.
    const getUserQuery = useQuery({
        queryKey: ["logged-in-user"],
        queryFn: ({ signal }) => getUserService({ params: {}, signal }),
        // retry: true,
    });

    console.log("🚀 ~ AuthProvider logged in User ~ getUserQuery:", getUserQuery);

    useEffect(() => {
        if (getUserQuery?.isError) {
            if (location.pathname === "/login" || location.pathname === "/sign-up" || location.pathname === "/reset-password") {
                console.log("location is outside auth");
            } else if (!getUserQuery?.error?.response) {
                navigate("/login");
                toast.warning("Check Your Internet Connection Please");
            } else {
                // Redirect to the specified location
                navigate("/login");
            }
            console.log("Error getUserQuery :", getUserQuery?.error);
            if (getUserQuery?.error?.response?.data?.message) {
                if (getUserQuery.error.response.data.message === "Unauthenticated.") {
                    navigate("/login"); // Navigate to the login page
                    toast.warning("No Active Session. Please log in.");
                    // window.location.reload(); // Reload the window
                } else {
                    toast.error(getUserQuery.error.response.data.message);
                }
            } else if (!getUserQuery?.error?.response) {
                toast.warning("Check Your Internet Connection Please");
            } else {
                toast.error("An Error Occurred. Please Contact Admin");
            }
        }
    }, [getUserQuery?.isError]);

    //memorised user data
    const userData = useMemo(() => getUserQuery.data?.data, [getUserQuery.data]);

    //===================== successfully logged in =======================
    if (getUserQuery.isSuccess) {
        console.log("user data from auth context:", userData);

        if (!userData) {
            if (location.pathname === "/login" || location.pathname === "/sign-up" || location.pathname === "/reset-password") {
                console.log("location is outside auth");
            } else {
                navigate("/dashboard"); // Redirect to the specified location
            }
        } else {
            if (userData.message === "Unauthenticated.") {
                // Handle "Unauthenticated" error
                console.log("User not logged in");
                if (location.pathname === "/login" || location.pathname === "/sign-up" || location.pathname === "/reset-password") {
                    console.log("location is outside auth");
                } else {
                    navigate("/login"); // Redirect to the specified location
                }
            }
        }
    }

    // Logout mutation function
    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: (data) => {
            setLogoutMutationIsLoading(false);
            // Reset the user state to null
            queryClient.resetQueries();
            queryClient.clear();
            queryClient.refetchQueries();

            // Remove the Authorization header from Axios
            axios.defaults.headers.common["Authorization"] = null;

            // Remove the Authorization header from Axios
            delete axios.defaults.headers.common["Authorization"];

            // clear local storage
            // localStorage.removeItem("access_token");
            // localStorage.removeItem("refresh_token");

            // Set localStorage items to null
            localStorage.setItem("access_token", "null");
            localStorage.setItem("refresh_token", "null");

            // Set loading state to false
            console.log("logout response is : ", data);
            navigate("/login");
            window.location.reload();
            // Display a success toast message
            toast.success("Goodbye 👋");
        },
        onError: (error) => {
            setLogoutMutationIsLoading(false);
            // Display an error toast message
            toast.error("Logout Error");

            // Log the error
            console.log("Logout errors ", error);
        },
    });

    return (
        <AuthContext.Provider
            value={{
                getUserQuery,
                logoutMutation,
                setLogoutMutationIsLoading,
                logoutMutationIsLoading,
                errors,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default function useAuthContext() {
    return useContext(AuthContext);
}
