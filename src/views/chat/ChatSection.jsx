import React from "react";
import ChatTopbar from "./widgets/chat_section/ChatTopbar";
import Messages from "./widgets/chat_section/Messages";
import MessageBox from "./widgets/chat_section/MessageBox";
import styles from "./widgets/styles";

const ChatSection = ({ selectedUser, currentUser, messages, onSendMessage, users }) => (
    <div style={styles.chatSection}>
        <ChatTopbar user={selectedUser} />
        <Messages messages={messages} currentUser={currentUser} users={users} />
        <MessageBox onSendMessage={onSendMessage} />
    </div>
);

export default ChatSection;
