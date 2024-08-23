import React from "react";
import styles from "../styles";

const ChatTopbar = ({ user }) => (
    <div style={styles.chatTopbar}>
        <img src={user.avatar} alt={user.name} style={styles.avatar} />
        <h3>{user.name}</h3>
    </div>
);

export default ChatTopbar;
