import React, { useState, useEffect } from "react";

import { Dialog } from "primereact/dialog";

import { getAllProductCategoryBrands, getProductCategoryBrandById, postProductCategoryBrand, updateProductCategoryBrand, deleteProductCategoryBrandById } from "../../services/products/product-category-brands-service";

import RowForm from "./widgets/RowForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";

//
import handleMutationError from "../../hooks/handleMutationError";

function CreateForm({ productCategoryData, ...props }) {
    const [name, setName] = useState();
    const [details, setDetails] = useState();
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [validated, setValidated] = useState(true);

    const queryClient = useQueryClient();

    const [creactMutationIsLoading, setCreactMutationIsLoading] = useState(false);
    const creactMutation = useMutation({
        mutationFn: postProductCategoryBrand,
        onSuccess: () => {
            queryClient.invalidateQueries(["category_brands"]);
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
        <Dialog header="Product Category Brand Form" visible={props.show} maximizable style={{ minWidth: "50vw" }} onHide={() => props.onHide()}>
            <p>Fill in the form below</p>
            <RowForm handleSubmit={handleSubmit} productCategoryData={productCategoryData} />
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
