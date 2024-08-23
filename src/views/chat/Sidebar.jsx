import React from "react";
import SidebarTopbar from "./widgets/sidebar/SidebarTopbar";
import Search from "./widgets/sidebar/Search";
import Chats from "./widgets/sidebar/Chats";
import styles from "./widgets/styles";

const Sidebar = ({ loggedInUserData, users, getListOfUsers, onSelectUser }) => (
    <div style={styles.sidebar}>
        <SidebarTopbar />
        <Search />
        <Chats loggedInUserData={loggedInUserData} getListOfUsers={getListOfUsers} users={users} onSelectUser={onSelectUser} />
    </div>
);

export default Sidebar;