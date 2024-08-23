import React from "react";
import styles from "../styles";

const Messages = ({ messages, currentUser }) => (
    <div style={styles.messages}>
        {messages.map((message) => (
            <div
                key={message.id}
                style={{
                    ...styles.messageWrapper,
                    justifyContent: message.senderId === currentUser.id ? "flex-end" : "flex-start",
                }}
            >
                <div
                    style={{
                        ...styles.message,
                        ...(message.senderId === currentUser.id ? styles.sentMessage : styles.receivedMessage),
                    }}
                >
                    <p style={styles.messageText}>{message.text}</p>
                    <span style={styles.messageTime}>{new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
            </div>
        ))}
    </div>
);

export default Messages;
