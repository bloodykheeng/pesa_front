import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div style={styles.container}>
            <h1 style={styles.header}>404 - Page Not Found</h1>
            <p style={styles.text}>Sorry, the page you are looking for does not exist.</p>
            <Link to="/" style={styles.link}>
                Go back to Home
            </Link>
        </div>
    );
}

const styles = {
    container: {
        textAlign: "center",
        marginTop: "50px",
    },
    header: {
        fontSize: "48px",
        fontWeight: "bold",
    },
    text: {
        fontSize: "18px",
        marginBottom: "20px",
    },
    link: {
        fontSize: "18px",
        color: "#007BFF",
        textDecoration: "none",
    },
};

export default NotFoundPage;
