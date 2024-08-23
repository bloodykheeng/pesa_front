import React from "react";
import styles from "../styles";

const Messages = ({ messages, currentUser, users }) => (
    <div style={styles.messages}>
        {messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            const senderName = isCurrentUser ? "You" : users.find((user) => user.id === message.senderId)?.name || "Unknown";

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
                        <p style={styles.messageText}>{message.text}</p>
                        <span style={styles.messageTime}>{new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                </div>
            );
        })}
    </div>
);

export default Messages;
