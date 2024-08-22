import { toast } from "react-toastify";

const useHandleMutationError = (error, setIsLoading) => {
    if (error) {
        setIsLoading(false);
        if (error?.response?.data?.message) {
            toast.error(error.response.data.message);
        } else if (!error?.response) {
            toast.warning("Check Your Internet Connection Please");
        } else {
            toast.error("An Error Occurred. Please Contact Admin");
        }
    }
};

export default useHandleMutationError;
