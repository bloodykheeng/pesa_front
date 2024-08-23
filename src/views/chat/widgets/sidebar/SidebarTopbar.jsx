import React from "react";
import styles from "../styles";

const SidebarTopbar = () => (
    <div style={styles.sidebarTopbar}>
        <h2 style={styles.sidebarTitle}>Lama Chat</h2>
        <button style={styles.logoutButton}>Logout</button>
    </div>
);

export default SidebarTopbar;
