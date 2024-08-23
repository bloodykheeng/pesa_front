import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import styles from "../styles";

const Chats = ({ loggedInUserData, getListOfUsers, users, onSelectUser }) => {
    return (
        <div style={styles.chats}>
            {getListOfUsers?.isLoading ? (
                <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <ProgressSpinner style={styles.spinner} />
                </div>
            ) : (
                users
                    .filter((user) => user?.id !== loggedInUserData?.id) // Exclude the logged-in user
                    .map((user) => (
                        <div key={user?.id} style={styles.chatItem} onClick={() => onSelectUser(user)}>
                            <img
                                // src={user?.avatar}
                                src={user?.cloudinary_photo_url ? user?.cloudinary_photo_url : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
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
