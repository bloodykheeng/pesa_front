import React, { useState, useEffect } from "react";

import { getAllProducts, getProductById, postProduct, updateProduct, deleteProductById } from "../../services/products/products-service";

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
        mutationFn: (variables) => updateProduct(props?.rowData?.id, variables),
        onSuccess: () => {
            setEditMutationIsLoading(false);
            props.onClose();
            toast.success("Edited Successfully");
            queryClient.invalidateQueries(["products"]);
        },
        onError: (error) => {
            handleMutationError(error, setEditMutationIsLoading);
        },
    });

    // const handleSubmit = (data) => {
    //     console.log(data);

    //     editMutation.mutate(data);
    // };

    const handleSubmit = async (data) => {
        setEditMutationIsLoading(true);
        console.log("product sdbfsd Data we are submitting: ", data);

        const formData = new FormData();
        formData.append("_method", "PUT");
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

        // Log formData keys and values for debugging
        // formData.forEach((value, key) => {
        //     console.log(`${key}: ${value}`);
        // });

        editMutation.mutate(formData);
    };
    return (
        <Dialog header="Product Form" visible={props.show} maximizable style={{ minWidth: "50vw" }} onHide={() => props.onHide()}>
            {/* <h3>Programs Edit Form</h3> */}
            <p>Edit Data Below</p>
            <RowForm initialData={props.rowData} electronicTypeData={props?.electronicTypeData} handleSubmit={handleSubmit} />
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
