import React, { useState } from "react";
import { Card } from "primereact/card";
import Sidebar from "./Sidebar";
import ChatSection from "./ChatSection";
import { users, messages } from "./sampleData";
import { users as initialUsers, messages as initialMessages } from "./sampleData";
import styles from "./widgets/styles";

const ChatPage = () => {
    const [users, setUsers] = useState(initialUsers);
    const [messages, setMessages] = useState(initialMessages);
    const [selectedUser, setSelectedUser] = useState(users[0]);

    const handleSendMessage = (newMessage) => {
        const updatedMessages = [
            ...messages,
            {
                id: messages.length + 1,
                senderId: selectedUser.id,
                receiverId: selectedUser.id === 1 ? 2 : 1, // This is a simplification
                text: newMessage,
                timestamp: new Date(),
            },
        ];
        setMessages(updatedMessages);
    };

    return (
        <Card style={styles.lamaChat}>
            <div style={styles.chatContainer}>
                <Sidebar users={users} onSelectUser={setSelectedUser} />
                <ChatSection
                    selectedUser={selectedUser}
                    currentUser={users[0]} // Assuming the first user is the current user
                    messages={messages.filter((m) => m.senderId === selectedUser.id || m.receiverId === selectedUser.id)}
                    onSendMessage={handleSendMessage}
                    users={users}
                />
            </div>
        </Card>
    );
};

export default ChatPage;
