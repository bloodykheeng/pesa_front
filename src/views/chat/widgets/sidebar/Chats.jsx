import React from "react";
import styles from "../styles";

const Chats = ({ users, onSelectUser }) => (
    <div style={styles.chats}>
        {users.map((user) => (
            <div key={user.id} style={styles.chatItem} onClick={() => onSelectUser(user)}>
                <img src={user.avatar} alt={user.name} style={styles.avatar} />
                <div>
                    <h3 style={styles.userName}>{user.name}</h3>
                    <p style={styles.userStatus}>{user.status}</p>
                </div>
            </div>
        ))}
    </div>
);

export default Chats;
