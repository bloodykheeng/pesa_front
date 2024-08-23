import React, { useState } from "react";
import styles from "../styles";

const MessageBox = ({ onSendMessage }) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage("");
        }
    };

    return (
        <div style={styles.messageBox}>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." style={styles.messageInput} />
            <button onClick={handleSend} style={styles.sendButton}>
                Send
            </button>
        </div>
    );
};

export default MessageBox;
