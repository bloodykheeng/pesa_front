import React, { useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import styles from "../styles";
import { getAllMessages } from "../../../../services/messages/messages-service";
import useHandleQueryError from "../../../../hooks/useHandleQueryError";

import moment from "moment";

const Messages = ({ loggedInUserData, selectedUser, newBroadcastedChannelMessages, setNewBroadcastedChannelMessages }) => {
    const messagesEndRef = useRef(null);

    const {
        data: fetchedData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["messages", "by_logged_in_user_id", loggedInUserData?.id, "by_selected_user_id", selectedUser?.id],
        queryFn: () => getAllMessages({ sender_id: loggedInUserData?.id, reciver_id: selectedUser?.id }),
        enabled: selectedUser ? true : false,
    });

    const newMemoBroadcastedChannelMessages = useMemo(() => newBroadcastedChannelMessages, [newBroadcastedChannelMessages]);

    const data = useMemo(() => {
        if (fetchedData?.data?.data) {
            // Merge new broadcasted messages with fetched data
            const mergedMessages = [...fetchedData.data.data, ...newMemoBroadcastedChannelMessages];

            return { ...fetchedData, data: { ...fetchedData.data, data: mergedMessages } };
        }
        return fetchedData;
    }, [fetchedData, newMemoBroadcastedChannelMessages]);

    // useEffect(() => {
    //     // Clear newBroadcastedChannelMessages after merging
    //     setNewBroadcastedChannelMessages([]);
    // }, [data]);

    useHandleQueryError(isError, error);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [data]);

    return (
        <div style={styles.messages}>
            {isLoading ? (
                <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <ProgressSpinner style={styles.spinner} />
                </div>
            ) : !Array.isArray(data?.data?.data) || data?.data?.data?.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "20px" }}>{selectedUser ? <p>No messages to view.</p> : <p>Please select a Chat.</p>}</div>
            ) : (
                data?.data?.data?.map((message) => {
                    const isCurrentUser = message.sender_id === loggedInUserData?.id;
                    const senderName = isCurrentUser ? "You" : message?.sender?.name;

                    return (
                        <div
                            key={message.id}
                            style={{
                                ...styles.messageWrapper,
                                justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                            }}
                        >
                            <div
                                style={{
                                    ...styles.message,
                                    ...(isCurrentUser ? styles.sentMessage : styles.receivedMessage),
                                }}
                            >
                                <span style={styles.messageSender}>{senderName}</span>
                                <p style={styles.messageText}>{message?.content}</p>
                                <span style={styles.messageTime}> {moment(message?.created_at).format("h:mm A")}</span>
                            </div>
                        </div>
                    );
                })
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default Messages;
