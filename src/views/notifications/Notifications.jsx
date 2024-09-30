import React, { useState } from "react";
import RowForm from "./RowForm";
import { toast } from "react-toastify";
import { Panel } from "primereact/panel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { postTosendNotification } from "../../services/notification/notifications-service";
import handleMutationError from "../../hooks/handleMutationError";

function Notifications() {
    const queryClient = useQueryClient();
    const [submittedMessage, setSubmittedMessage] = useState("");
    console.log("🚀 ~ Notifications ~ submittedMessage:", submittedMessage);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState();

    // Mutation for creating the FAQ
    const mutation = useMutation({
        mutationFn: postTosendNotification,
        onSuccess: (data) => {
            console.log("🚀 ~ Notifications ~ data:", data);
            queryClient.invalidateQueries(["notifications"]);
            setSubmittedMessage(data?.data?.message);
            toast.success("Message submitted successfully!");
            setIsSubmitting(false);
        },
        onError: (error) => {
            handleMutationError(error, setIsSubmitting);
            setIsSubmitting(false);
        },
    });

    const handleFormSubmit = (data) => {
        setFormData(data);
        setSubmittedMessage(null);
        setIsSubmitting(true); // Show the spinner
        mutation.mutate(data);
    };

    return (
        <div className="notifications-page">
            {/* PrimeReact Panel for layout */}
            <Panel header="Submit Your Notification">
                {/* Show spinner while mutation is loading */}
                {isSubmitting ? (
                    <div className="spinner-container" style={{ textAlign: "center" }}>
                        <ProgressSpinner />
                        <p>Submitting...</p>
                    </div>
                ) : (
                    <RowForm handleSubmit={handleFormSubmit} initialData={formData} />
                )}

                {/* Display the submitted message after successful submission */}
                {submittedMessage && (
                    <div className="card submitted-message">
                        <h3>Submitted Message:</h3>
                        <p>{submittedMessage}</p>
                    </div>
                )}
            </Panel>
        </div>
    );
}

export default Notifications;
