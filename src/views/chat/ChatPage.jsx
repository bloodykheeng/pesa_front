import React, { useState } from "react";
import { Card } from "primereact/card";
import Sidebar from "./Sidebar";
import ChatSection from "./ChatSection";
import { users, messages } from "./sampleData";
import styles from "./widgets/styles";

const ChatPage = () => {
    const [selectedUser, setSelectedUser] = useState(users[0]);

    return (
        <Card style={styles.lamaChat}>
            <div style={styles.chatContainer}>
                <Sidebar users={users} onSelectUser={setSelectedUser} />
                <ChatSection selectedUser={selectedUser} messages={messages} />
            </div>
        </Card>
    );
};

export default ChatPage;
