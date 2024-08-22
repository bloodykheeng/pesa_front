import React, { useState, useEffect } from "react";

import { getAllUsers, getUserById, getApproverRoles, createUser, updateUser, deleteUserById, getAssignableRoles } from "../../services/auth/user-service";

import RowForm from "./widgets/RowForm";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";

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
            setEditMutationIsLoading(false);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
            console.log("create programs error : ", error);
        },
    });

    const handleSubmit = (data) => {
        console.log("updating user : ", data);
        setEditMutationIsLoading(true);
        editMutation.mutate(data);
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
