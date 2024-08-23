import React from "react";
import styles from "../styles";

const ChatTopbar = ({ user }) => (
    <div style={styles.chatTopbar}>
        <img src={user?.cloudinary_photo_url ? user?.cloudinary_photo_url : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} alt={user?.name} style={styles?.avatar} />
        <h3>{user?.name}</h3>
    </div>
);

export default ChatTopbar;
