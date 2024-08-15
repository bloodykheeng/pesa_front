import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";

const useHandleQueryError = (isError, error) => {
    // Memoize the error object
    const memoizedError = useMemo(() => error, [error]);

    useEffect(() => {
        if (isError) {
            console.log("Error fetching List of data:", memoizedError);
            if (memoizedError?.response?.data?.message) {
                toast.error(memoizedError.response.data.message);
            } else if (!memoizedError?.response) {
                toast.warning("Check Your Internet Connection Please");
            } else {
                toast.error("An Error Occurred. Please Contact Admin");
            }
        }
    }, [isError, memoizedError]);
};

export default useHandleQueryError;
