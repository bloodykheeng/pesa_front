import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import styles from "../styles";

const Chats = ({ getListOfUsers, users, onSelectUser }) => {
    return (
        <div style={styles.chats}>
            {getListOfUsers?.isLoading ? (
                <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <ProgressSpinner style={styles.spinner} />
                </div>
            ) : (
                users.map((user) => (
                    <div key={user?.id} style={styles.chatItem} onClick={() => onSelectUser(user)}>
                        <img
                            // src={user?.avatar}
                            src={"https://randomuser.me/api/portraits/men/1.jpg"}
                            alt={user?.name}
                            style={styles.avatar}
                        />
                        <div>
                            <p style={styles.userName}>{user?.name}</p>
                            <p style={styles.userStatus}>{user?.status}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Chats;
