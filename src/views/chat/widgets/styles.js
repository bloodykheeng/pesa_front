const styles = {
    lamaChat: {
        width: "800px",
        margin: "0 auto",
    },
    chatContainer: {
        display: "flex",
        height: "600px",
    },
    sidebar: {
        width: "30%",
        borderRight: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
    },
    sidebarTopbar: {
        padding: "1rem",
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sidebarTitle: {
        margin: 0,
    },
    logoutButton: {
        padding: "0.5rem",
        backgroundColor: "#f0f0f0",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    searchInput: {
        width: "100%",
        padding: "0.5rem",
        border: "none",
        borderBottom: "1px solid #ccc",
    },
    chats: {
        overflowY: "auto",
        flexGrow: 1,
    },
    chatItem: {
        display: "flex",
        alignItems: "center",
        padding: "1rem",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#f0f0f0",
        },
    },
    avatar: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        marginRight: "1rem",
    },
    userName: {
        margin: 0,
    },
    userStatus: {
        margin: 0,
        fontSize: "0.8rem",
        color: "#666",
    },
    chatSection: {
        width: "70%",
        display: "flex",
        flexDirection: "column",
    },
    chatTopbar: {
        padding: "1rem",
        borderBottom: "1px solid #ccc",
        display: "flex",
        alignItems: "center",
    },
    messages: {
        flexGrow: 1,
        overflowY: "auto",
        padding: "1rem",
    },
    message: {
        maxWidth: "70%",
        padding: "0.5rem",
        borderRadius: "8px",
        marginBottom: "0.5rem",
        backgroundColor: "#f0f0f0",
    },
    sentMessage: {
        backgroundColor: "#dcf8c6",
        alignSelf: "flex-end",
    },
    messageText: {
        margin: 0,
    },
    messageTime: {
        fontSize: "0.7rem",
        color: "#666",
    },
    messageBox: {
        display: "flex",
        padding: "1rem",
        borderTop: "1px solid #ccc",
    },
    messageInput: {
        flexGrow: 1,
        padding: "0.5rem",
        marginRight: "0.5rem",
    },
    sendButton: {
        padding: "0.5rem 1rem",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
};

export default styles;
