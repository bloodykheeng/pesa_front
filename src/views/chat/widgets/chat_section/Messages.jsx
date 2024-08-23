import React from "react";
import styles from "../styles";

const Messages = ({ messages, currentUser }) => (
    <div style={styles.messages}>
        {messages.map((message) => (
            <div
                key={message.id}
                style={{
                    ...styles.message,
                    ...(message.senderId === currentUser.id ? styles.sentMessage : {}),
                }}
            >
                <p style={styles.messageText}>{message.text}</p>
                <span style={styles.messageTime}>{message.timestamp.toLocaleTimeString()}</span>
            </div>
        ))}
    </div>
);

export default Messages;
