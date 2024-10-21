import React, { useState, useEffect } from "react";

import { Dialog } from "primereact/dialog";

import { getAllProducts, getProductById, postProduct, updateProduct, deleteProductById } from "../../services/products/products-service";

import RowForm from "./widgets/RowForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";

import useHandleQueryError from "../../hooks/useHandleQueryError";
import handleMutationError from "../../hooks/handleMutationError";

function CreateForm(props) {
    const queryClient = useQueryClient();

    const [creactMutationIsLoading, setCreactMutationIsLoading] = useState(false);
    const creactMutation = useMutation({
        mutationFn: postProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(["products"]);
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
        console.log("products data we are submitting : ", data);

        const formData = new FormData();
        formData.append("name", data?.name);
        formData.append("price", data?.price);
        formData.append("quantity", data?.quantity);
        // formData.append("product_types_id", data?.product_types?.id);

        // formData.append("code", data.code);
        formData.append("details", data?.details);
        formData.append("status", data?.status);
        formData.append("photo", data?.photo); // Assuming 'photo' is the field name for the file upload
        // formData.append("category_brands_id", data?.category_brand?.id); // Existing one

        // Add the other fields with optional chaining
        // formData.append("inventory_types_id", data?.inventory_type?.id);
        // formData.append("electronic_category_id", data?.electronic_category?.id);
        // formData.append("electronic_brand_id", data?.electronic_brand?.id);
        // formData.append("electronic_type_id", data?.electronic_type?.id);

        // Append 'product_types_id' only if it exists
        if (data?.product_type?.id !== undefined) {
            formData.append("product_types_id", data.product_type.id);
        }

        // Append 'category_brands_id' only if it exists
        if (data?.category_brand?.id !== undefined) {
            formData.append("category_brands_id", data.category_brand.id);
        }

        // Append 'inventory_types_id' only if it exists
        if (data?.inventory_type?.id !== undefined) {
            formData.append("inventory_types_id", data.inventory_type.id);
        }

        // Append 'electronic_category_id' only if it exists
        if (data?.electronic_category?.id !== undefined) {
            formData.append("electronic_category_id", data.electronic_category.id);
        }

        // Append 'electronic_brand_id' only if it exists
        if (data?.electronic_brand?.id !== undefined) {
            formData.append("electronic_brand_id", data.electronic_brand.id);
        }

        // Append 'electronic_type_id' only if it exists
        if (data?.electronic_type?.id !== undefined) {
            formData.append("electronic_type_id", data.electronic_type.id);
        }

        creactMutation.mutate(formData);
    };

    return (
        <Dialog header="Product Form" visible={props.show} maximizable style={{ minWidth: "50vw" }} onHide={() => props.onHide()}>
            <p>Fill in the form below</p>
            <RowForm handleSubmit={handleSubmit} electronicTypeData={props?.electronicTypeData} productCategoryBrandData={props?.productCategoryBrandData} />
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
