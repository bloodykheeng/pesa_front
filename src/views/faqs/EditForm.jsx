import React, { useState, useEffect } from "react";

import { getAllFaqs, getFaqById, postFaq, updateFaq, deleteFaqById } from "../../services/faqs/faqs-service";

import RowForm from "./widgets/RowForm";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";

//
import handleMutationError from "../../hooks/handleMutationError";

function EditForm(props) {
    const queryClient = useQueryClient();

    const [editMutationIsLoading, setEditMutationIsLoading] = useState(false);
    const editMutation = useMutation({
        mutationFn: (variables) => updateFaq(props?.rowData?.id, variables),
        onSuccess: () => {
            setEditMutationIsLoading(false);
            props.onClose();
            toast.success("Edited Successfully");
            queryClient.invalidateQueries(["faqs"]);
        },
        onError: (error) => {
            setEditMutationIsLoading(false);
            // props.onClose();
            handleMutationError(error, setEditMutationIsLoading);
        },
    });

    // const handleSubmit = (data) => {
    //     console.log(data);

    //     editMutation.mutate(data);
    // };

    const handleSubmit = async (data) => {
        setEditMutationIsLoading(true);
        console.log("Data we are submitting: ", data);

        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("question", data.question);
        formData.append("answer", data.answer);
        // formData.append("photo", data.photo);

        editMutation.mutate(formData);
    };
    return (
        <Dialog header="Faqs Form" visible={props.show} maximizable style={{ minWidth: "50vw" }} onHide={() => props.onHide()}>
            {/* <h3>Programs Edit Form</h3> */}
            <p>Edit Data Below</p>
            <RowForm initialData={props.rowData} handleSubmit={handleSubmit} />
            {/* <h4>{creactProgramsMutation.status}</h4> */}

            {editMutationIsLoading && (
                <center>
                    <ProgressSpinner
                        style={{
                            width: "50px",
                            height: "50px",
                            borderWidth: "8px", // Border thickness
                            borderColor: "blue", // Border color
                            animationDuration: "1s",
                        }}
                        strokeWidth="8"
                        animationDuration="1s"
                    />
                </center>
            )}
        </Dialog>
    );
}

export default EditForm;
