import React from "react";
import SidebarTopbar from "./widgets/sidebar/SidebarTopbar";
import Search from "./widgets/sidebar/Search";
import Chats from "./widgets/sidebar/Chats";
import styles from "./widgets/styles";

const Sidebar = ({ users, onSelectUser }) => (
    <div style={styles.sidebar}>
        <SidebarTopbar />
        <Search />
        <Chats users={users} onSelectUser={onSelectUser} />
    </div>
);

export default Sidebar;
