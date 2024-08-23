import { useEffect, useState } from "react";
import axios from "axios"; // Import axios directly from the library
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { postBroadcast } from "../services/broadcating/broadcasting-service";
import { useMutation } from "@tanstack/react-query";

import axiosAPI from "../services/axiosApi";

window.Pusher = Pusher;

const useEcho = () => {
    // const queryClient = useQueryClient();

    // // Define the mutation using useMutation from TanStack Query
    // const authorizeBroadcastMutation = useMutation({
    //   mutationFn: () =>postBroadcast,
    //   onSuccess: (data) => {
    //       // queryClient.invalidateQueries(["counties"]);
    //       setLoading(false);
    //   },
    //   onError: (error) => {
    //       handleMutationError(error, setDeleteMutationIsLoading);
    //   },

    // });

    const [echoInstance, setEchoInstance] = useState(null);

    useEffect(() => {
        // Create the Echo instance here...
        const echo = new Echo({
            broadcaster: "reverb",
            key: process.env.REACT_APP_REVERB_APP_KEY,
            authorizer: (channel) => {
                return {
                    authorize: (socketId, callback) => {
                        axiosAPI
                            .post("/api/broadcasting/auth", {
                                socket_id: socketId,
                                channel_name: channel.name,
                            })
                            .then((response) => {
                                callback(false, response.data);
                            })
                            .catch((error) => {
                                callback(true, error);
                            });
                    },
                };
            },
            wsHost: process.env.REACT_APP_REVERB_HOST,
            wsPort: process.env.REACT_APP_REVERB_PORT ?? 80,
            wssPort: process.env.REACT_APP_REVERB_PORT ?? 443,
            forceTLS: (process.env.REACT_APP_REVERB_SCHEME ?? "https") === "https",
            enabledTransports: ["ws", "wss"],
        });

        setEchoInstance(echo);

        // Cleanup function to disconnect Echo instance when component unmounts
        return () => {
            echo.disconnect();
        };
    }, []);

    return echoInstance;
};

export default useEcho;
