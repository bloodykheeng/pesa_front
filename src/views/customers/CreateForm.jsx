import React, { useState, useEffect } from "react";

import { Dialog } from "primereact/dialog";

import { getAllUsers, getUserById, getApproverRoles, createUser, updateUser, deleteUserById, getAssignableRoles } from "../../services/auth/user-service";

import RowForm from "./widgets/RowForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";

function CreateForm({ loggedInUserData, ...props }) {
    const queryClient = useQueryClient();

    const [creactMutationIsLoading, setCreactMutationIsLoading] = useState(false);
    const creactMutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
            toast.success("created Successfully");
            setCreactMutationIsLoading(false);
            props.onClose();
        },
        onError: (error) => {
            // props.onClose();
            setCreactMutationIsLoading(false);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
            console.log("create programs error : ", error);
        },
    });

    const handleSubmit = async (data) => {
        // event.preventDefault();
        setCreactMutationIsLoading(true);
        console.log("data we are submitting while creating a user : ", data);
        creactMutation.mutate(data);
    };

    return (
        <Dialog header="Customers Form" visible={props.show} style={{ width: "60vw" }} onHide={() => props.onHide()} maximizable>
            <p>Fill in the form below</p>
            <RowForm loggedInUserData={loggedInUserData} handleSubmit={handleSubmit} project_id={props?.projectId} selectedParentItem={props?.selectedParentItem} />
            {/* <h4>{creactProgramsMutation.status}</h4> */}
            {creactMutationIsLoading && (
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
            {/* <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Program Form</Modal.Title>
            </Modal.Header>
            <Modal.Body>

            </Modal.Body>
        </Modal> */}
        </Dialog>
    );
}

export default CreateForm;
