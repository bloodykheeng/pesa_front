import React, { useState, useEffect, useMemo } from "react";
import { Card } from "primereact/card";
import Sidebar from "./Sidebar";
import ChatSection from "./ChatSection";
import { users, messages } from "./sampleData";
import { users as initialUsers, messages as initialMessages } from "./sampleData";
import styles from "./widgets/styles";

import { postMessage } from "../../services/messages/messages-service";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";

//
import { Howl } from "howler";
import useEcho from "../../hooks/echo";

import useAuthContext from "../../context/AuthContext";

//
import useHandleQueryError from "../../hooks/useHandleQueryError";
import handleMutationError from "../../hooks/handleMutationError";

//
import { getAllUsers, getUserById, getApproverRoles, createUser, updateUser, deleteUserById, getAssignableRoles } from "../../services/auth/user-service";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const ChatPage = () => {
    const queryClient = useQueryClient();
    const [users, setUsers] = useState(initialUsers);
    const [messages, setMessages] = useState(initialMessages);
    const [selectedUser, setSelectedUser] = useState(users[0]);

    const { getUserQuery } = useAuthContext();
    console.log("🚀 ~ ChatPage ~ getUserQuery:", getUserQuery?.data?.data);

    const loggedInUserData = getUserQuery?.data?.data;

    const echo = useEcho();
    console.log("🚀 ~ ChatPage ~ echo:", echo);

    const sound = new Howl({
        src: ["/media/bell.mp3"],
    });

    const handleEchoCallback = () => {
        // setUnreadMessages(prevUnread => prevUnread + 1)
        // triggerAnimation()
        sound.play();
    };

    //
    const memoizedValues = useMemo(() => {
        // return { user, unreadMessages, controls, echo };
        return { echo };
    }, [echo]);

    useEffect(() => {
        // Here we are going to listen for real-time events.
        if (echo) {
            console.log("🚀 ~ useEffect ~ echo in the if :", echo);
            echo.private(`chat.${loggedInUserData?.id}`).listen("MessageSent", (event) => {
                console.log("🚀 ttttt ~ echo.private ~ event:", event);

                if (event.receiver.id === loggedInUserData?.id) console.log("Real-time event received: ", event);

                handleEchoCallback();
            });

            echo.channel("example-chat").listen("Example", (event) => {
                console.log("🚀example chat public event", event);
            });
        }

        // axios
        //     .post("/api/get-unread-messages", {
        //         user_id: user?.id,
        //     })
        //     .then((res) => {
        //         setUnreadMessages(res.data.length);
        //         setMessages(res.data);
        //     });
    }, [memoizedValues]);

    //=============== sending a message ============================

    const [messageMutationIsLoading, setMessageMutationIsLoading] = useState(false);
    const sendMessageMutation = useMutation({
        mutationFn: postMessage,
        onSuccess: () => {
            // queryClient.invalidateQueries(["products"]);
            // toast.success("created Successfully");
            // setMessageMutationIsLoading(false);

            setMessageMutationIsLoading(false);
        },
        onError: (error) => {
            handleMutationError(error, setMessageMutationIsLoading);
        },
    });

    const handleSendMessage = (newMessage) => {
        const updatedMessages = [
            ...messages,
            {
                id: messages.length + 1,
                senderId: selectedUser.id,
                receiverId: selectedUser.id === 1 ? 2 : 1, // This is a simplification
                text: newMessage,
                timestamp: new Date(),
            },
        ];
        setMessages(updatedMessages);

        let messsagePayload = {
            chat_id: null,
            sender_id: loggedInUserData?.id,
            reciver_id: selectedUser.id,
            content: newMessage,
        };
        sendMessageMutation.mutate(messsagePayload);
    };

    // get list of users

    const getListOfUsers = useQuery({ queryKey: ["users"], queryFn: getAllUsers });
    console.log("users list : ", getListOfUsers?.data?.data);

    // Use the custom hook to handle errors with useMemo on the error object
    useHandleQueryError(getListOfUsers?.isError, getListOfUsers?.error);

    return (
        <Card style={styles.lamaChat}>
            <div style={styles.chatContainer}>
                <Sidebar loggedInUserData={loggedInUserData} getListOfUsers={getListOfUsers} users={getListOfUsers?.data?.data?.data} onSelectUser={setSelectedUser} />
                <ChatSection
                    selectedUser={selectedUser}
                    currentUser={users[0]} // Assuming the first user is the current user
                    messages={messages.filter((m) => m.senderId === selectedUser.id || m.receiverId === selectedUser.id)}
                    onSendMessage={handleSendMessage}
                    users={users}
                    loggedInUserData={loggedInUserData}
                />
            </div>
        </Card>
    );
};

export default ChatPage;
