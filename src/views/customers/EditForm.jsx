import React, { useState, useEffect } from "react";

import { getAllUsers, getUserById, getApproverRoles, createUser, updateUser, deleteUserById, getAssignableRoles } from "../../services/auth/user-service";

import RowForm from "./widgets/RowForm";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";

//
import handleMutationError from "../../hooks/handleMutationError";

function EditForm({ loggedInUserData, ...props }) {
    const queryClient = useQueryClient();

    const [editMutationIsLoading, setEditMutationIsLoading] = useState(false);
    const editMutation = useMutation({
        mutationFn: (variables) => updateUser(props?.rowData?.id, variables),
        onSuccess: () => {
            setEditMutationIsLoading(false);
            props.onClose();
            toast.success("Edited Successfully");
            queryClient.invalidateQueries(["users"]);
        },
        onError: (error) => {
            // props.onClose();
            handleMutationError(error, setEditMutationIsLoading);
        },
    });

    // const handleSubmit = (data) => {
    //     console.log("updating user : ", data);
    //     setEditMutationIsLoading(true);
    //     editMutation.mutate(data);
    // };

    const handleSubmit = async (data) => {
        setEditMutationIsLoading(true);
        console.log("Data we are submitting: ", data);

        const formData = new FormData();
        formData.append("_method", "PUT");

        // Adding the new fields
        formData.append("name", data?.name);
        formData.append("phone", data?.phone ?? null);
        formData.append("email", data?.email);
        formData.append("role", data?.role);
        formData.append("nin", data.nin ?? null);
        // formData.append("date_of_birth", data.date_of_birth ?? null);
        formData.append("gender", data.gender ?? null);
        formData.append("status", data.status);
        formData.append("lastlogin", data.lastlogin ?? new Date().toISOString());
        // formData.append("description", data.description);

        formData.append("photo", data.photo); // Assuming 'photo' is the field name for the file upload

        // Log formData keys and values for debugging (optional)
        // formData.forEach((value, key) => {
        //     console.log(`${key}: ${value}`);
        // });

        editMutation.mutate(formData);
    };

    return (
        <Dialog header="Customers Form" visible={props.show} style={{ width: "60vw" }} onHide={() => props.onHide()} maximizable>
            {/* <h3>Programs Edit Form</h3> */}
            <p>Edit Data Below</p>
            <RowForm loggedInUserData={loggedInUserData} initialData={props.rowData} handleSubmit={handleSubmit} selectedParentItem={props?.selectedParentItem} />
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
