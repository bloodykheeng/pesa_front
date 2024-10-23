import React, { useState, useEffect } from "react";

import { Dialog } from "primereact/dialog";

import { getAllElectronicTypes, getElectronicTypeById, postElectronicType, updateElectronicType, deleteElectronicTypeById } from "../../services/electronics/electronic-types-service.js";

import RowForm from "./widgets/RowForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";

//
import handleMutationError from "../../hooks/handleMutationError";

function CreateForm({ electronicBrandsData, ...props }) {
    const queryClient = useQueryClient();

    const [creactMutationIsLoading, setCreactMutationIsLoading] = useState(false);
    const creactMutation = useMutation({
        mutationFn: postElectronicType,
        onSuccess: () => {
            queryClient.invalidateQueries(["electronic_types"]);
            toast.success("created Successfully");
            props.onClose();
            setCreactMutationIsLoading(false);
        },
        onError: (error) => {
            handleMutationError(error, setCreactMutationIsLoading);
        },
    });

    const handleSubmit = async (data) => {
        // event.preventDefault();
        setCreactMutationIsLoading(true);
        console.log("data we are submitting : ", data);
        creactMutation.mutate(data);
    };

    return (
        <Dialog header="Electronic Type Brand Form" visible={props.show} maximizable style={{ minWidth: "50vw" }} onHide={() => props.onHide()}>
            <p>Fill in the form below</p>
            <RowForm handleSubmit={handleSubmit} electronicBrandsData={electronicBrandsData} />
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
