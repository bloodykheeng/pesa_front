import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Adjust this if you are using a different routing library
import { toast } from "react-toastify";

const useHandleQueryError = (isError, error) => {
    const navigate = useNavigate(); // Initialize the navigation function

    // Memoize the error object
    const memoizedError = useMemo(() => error, [error]);

    useEffect(() => {
        if (isError) {
            console.log("🚀 ~ useHandleQueryError ~ isError fetching List of data : ", isError);

            if (memoizedError?.response?.data?.message) {
                const errorMessage = memoizedError.response.data.message;
                toast.error(errorMessage);

                if (errorMessage === "Unauthenticated.") {
                    navigate("/login"); // Navigate to the login page
                    toast.warning("Session expired. Please log in again.");
                    window.location.reload(); // Reload the window
                }
            } else if (!memoizedError?.response) {
                toast.warning("Check Your Internet Connection Please");
            } else {
                toast.error("An Error Occurred. Please Contact Admin");
            }
        }
    }, [isError, memoizedError]);
};

export default useHandleQueryError;
