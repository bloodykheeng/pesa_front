import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import { Dropdown } from "primereact/dropdown";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classNames } from "primereact/utils";

import setFieldTouched from "final-form-set-field-touched";
//
import { toast } from "react-toastify";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DeleteIcon from "@mui/icons-material/Delete";
import { FileUpload } from "primereact/fileupload";

//
import { AutoComplete } from "primereact/autocomplete";
import { ProgressSpinner } from "primereact/progressspinner";
import { getAllProductCategoryBrands, getProductCategoryBrandById, postProductCategoryBrand, updateProductCategoryBrand, deleteProductCategoryBrandById } from "../../../services/products/product-category-brands-service";
import { getAllProductTypes, getProductTypeById, postProductType, updateProductType, deleteProductTypeById } from "../../../services/products/product-types-service";

function RowForm({ handleSubmit, productCategoryBrandData, initialData, ...props }) {
    console.log("🚀df ~ RowForm ~ initialData:", initialData);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const queryClient = useQueryClient();

    const [photoError, setPhotoError] = useState(null);
    const [photoTouched, setPhotoTouched] = useState(false);

    const validate = (values) => {
        const errors = {};

        if (!values.name) errors.name = "Name is required";

        // if (!values.code) errors.code = "Code is required";
        // if (!values.description) errors.description = "Description are required";
        if (!values.category_brands_id) errors.category_brands_id = "Product Category is required";
        if (!values.product_types_id) errors.product_types_id = "Product Type is required";

        if (!values.status) {
            errors.status = "Status is required";
        }
        if (!values.details) errors.details = "Details is required";
        if (!values.price) errors.price = "Price is required";
        if (!values.quantity) errors.quantity = "Quantity is required";

        return errors;
    };

    //====================== product categories  Brand========================
    const [selectedProductCategoryBrand, setSelectedProductCategoryBrand] = useState(productCategoryBrandData ?? initialData?.category_brand);
    const [filteredProductCategoryBrand, setFilteredProductCategoryBrand] = useState();

    if (!initialData) {
        initialData = { category_brands_id: productCategoryBrandData?.id };
    }

    const getAllProductCategoryBrandsQuery = useQuery({
        queryKey: ["category_brands"],
        queryFn: getAllProductCategoryBrands,
    });

    useEffect(() => {
        if (getAllProductCategoryBrandsQuery?.isError) {
            console.log("Error fetching List of data :", getAllProductCategoryBrandsQuery?.error);
            getAllProductCategoryBrandsQuery?.error?.response?.data?.message
                ? toast.error(getAllProductCategoryBrandsQuery?.error?.response?.data?.message)
                : !getAllProductCategoryBrandsQuery?.error?.response
                ? toast.warning("Check Your Internet Connection Please")
                : toast.error("An Error Occured Please Contact Admin");
        }
    }, [getAllProductCategoryBrandsQuery?.isError]);

    //====================== product types========================
    const [selectedProductType, setSelectedProductType] = useState(initialData?.product_type);
    const [filteredProductType, setFilteredProductType] = useState();

    const getAllProductTypesQuery = useQuery({
        queryKey: ["product-types"],
        queryFn: getAllProductTypes,
    });

    useEffect(() => {
        if (getAllProductTypesQuery?.isError) {
            console.log("Error fetching List of data :", getAllProductTypesQuery?.error);
            getAllProductTypesQuery?.error?.response?.data?.message ? toast.error(getAllProductTypesQuery?.error?.response?.data?.message) : !getAllProductTypesQuery?.error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        }
    }, [getAllProductTypesQuery?.isError]);

    // const onSubmitForm = (data) => {
    //     const errors = validate(data);
    //     if (Object.keys(errors).length === 0) {
    //         // No validation errors
    //         setPendingData(data);
    //         setShowConfirmDialog(true);
    //     } else {
    //         toast.warning("First Fill In All Required Fields");
    //     }
    // };
    const onSubmitForm = (data, form) => {
        const errors = validate(data);
        // Check if photo is uploaded
        if (!uploadedFile && !initialData) {
            setPhotoError("A photo is required");
        }

        if (Object.keys(errors).length === 0 && !photoError) {
            const formData = { ...data, photo: uploadedFile };
            setPendingData(formData);
            setShowConfirmDialog(true);
        } else {
            // Mark all fields as touched to show validation errors
            Object.keys(errors).forEach((field) => {
                form.mutators.setFieldTouched(field, true);
            });
            setPhotoTouched(true); // Make sure to mark the photo as touched to show the error
            toast.warning("Please fill in all required fields and upload a photo.");
        }
    };

    const onConfirm = () => {
        if (pendingData) {
            handleSubmit(pendingData);
            setPendingData(null);
        }
        setShowConfirmDialog(false);
    };

    const onCancel = () => {
        setShowConfirmDialog(false);
    };
    const onFileUpload = (e) => {
        // Clear previous errors
        setPhotoError(null);
        setPhotoTouched(true); // Indicate that the user has interacted with the file input

        const file = e.files && e.files.length > 0 ? e.files[0] : null;
        if (file) {
            if (file.size > 2097152) {
                // Check file size
                setPhotoError("File size should be less than 2MB");
                setUploadedFile(null); // Clear the uploaded file on error
            } else {
                setUploadedFile(file); // Update the state with the new file
            }
        } else {
            setPhotoError("A photo is required");
            setUploadedFile(null); // Clear the uploaded file if no file is selected
        }
    };

    return (
        <div className="col-12 md:col-12">
            <div className="card p-fluid">
                <Form
                    onSubmit={onSubmitForm}
                    initialValues={initialData}
                    mutators={{ setFieldTouched }}
                    validate={validate}
                    render={({ handleSubmit, form, submitting, pristine, values }) => (
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                console.log("values hhh : ", values);
                                console.log("event fffff : ", event);
                                onSubmitForm(values, form);
                                // handleSubmit(event, values);
                            }}
                        >
                            <Field name="name">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="name">Name</label>
                                        <InputText {...input} id="name" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="price">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="price">Price</label>
                                        <InputText {...input} id="price" type="number" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="quantity">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="quantity">Quantity</label>
                                        <InputText {...input} id="quantity" type="number" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            {/* <Field name="code">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="code">Code</label>
                                        <InputText {...input} id="name" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="description">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="description">Description</label>
                                        <InputTextarea {...input} rows={5} cols={30} id="description" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field> */}

                            <Field name="status">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="status">Status</label>
                                        <Dropdown
                                            {...input}
                                            options={[
                                                { id: "active", name: "Active" },
                                                { id: "deactive", name: "Deactive" },
                                            ].map((role) => ({ label: role.name, value: role.id }))}
                                            placeholder="Select a Status"
                                            className={classNames({ "p-invalid": meta.touched && meta.error })}
                                        />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="category_brands_id">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="category_brands_id">Product Category</label>
                                        <AutoComplete
                                            value={selectedProductCategoryBrand?.name || ""}
                                            suggestions={filteredProductCategoryBrand}
                                            disabled={getAllProductCategoryBrandsQuery.isLoading}
                                            completeMethod={(e) => {
                                                const results = getAllProductCategoryBrandsQuery.data?.data?.data.filter((department) => {
                                                    return department.name.toLowerCase().includes(e.query.toLowerCase());
                                                });
                                                setFilteredProductCategoryBrand(results);
                                            }}
                                            field="name"
                                            dropdown={true}
                                            onChange={(e) => {
                                                if (typeof e.value === "string") {
                                                    // Update the display value to the typed string and reset the selected department
                                                    setSelectedProductCategoryBrand({ name: e.value });
                                                    input.onChange("");
                                                } else if (typeof e.value === "object" && e.value !== null) {
                                                    // Update the selected department and set the form state with the selected department's ID
                                                    setSelectedProductCategoryBrand(e.value);
                                                    input.onChange(e.value.id);
                                                }
                                            }}
                                            id="product_category"
                                            selectedItemTemplate={(value) => <div>{value ? value.name : "Select a Product Category"}</div>}
                                        />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        {getAllProductCategoryBrandsQuery.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
                                    </div>
                                )}
                            </Field>

                            <Field name="product_types_id">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="product_types_id">Product Type</label>
                                        <AutoComplete
                                            value={selectedProductType?.name || ""}
                                            suggestions={filteredProductType}
                                            disabled={getAllProductTypesQuery.isLoading}
                                            completeMethod={(e) => {
                                                const results = getAllProductTypesQuery.data?.data?.data.filter((department) => {
                                                    return department.name.toLowerCase().includes(e.query.toLowerCase());
                                                });
                                                setFilteredProductType(results);
                                            }}
                                            field="name"
                                            dropdown={true}
                                            onChange={(e) => {
                                                if (typeof e.value === "string") {
                                                    // Update the display value to the typed string and reset the selected department
                                                    setSelectedProductType({ name: e.value });
                                                    input.onChange("");
                                                } else if (typeof e.value === "object" && e.value !== null) {
                                                    // Update the selected department and set the form state with the selected department's ID
                                                    setSelectedProductType(e.value);
                                                    input.onChange(e.value.id);
                                                }
                                            }}
                                            id="product_type"
                                            selectedItemTemplate={(value) => <div>{value ? value.name : "Select a Product Type"}</div>}
                                        />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        {getAllProductCategoryBrandsQuery.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
                                    </div>
                                )}
                            </Field>

                            <Field name="details">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="details">details</label>
                                        <InputTextarea {...input} rows={5} cols={30} id="details" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            {/* FileUpload for photo with validation */}
                            <div className="p-field m-4">
                                <label htmlFor="photo">Photo</label>
                                <FileUpload name="photo" customUpload uploadHandler={onFileUpload} accept="image/*" maxFileSize={2097152} />
                                {photoTouched && photoError && <small className="p-error">{photoError}</small>}
                            </div>
                            <div className="d-grid gap-2">
                                <Button type="submit" label="Save" className="p-button-primary" icon="pi pi-check" />
                            </div>
                        </form>
                    )}
                />
                <Dialog
                    header="Confirmation"
                    visible={showConfirmDialog}
                    maximizable
                    style={{ minWidth: "30vw" }}
                    onHide={onCancel}
                    footer={
                        <div>
                            <Button label="Yes" onClick={onConfirm} />
                            <Button label="No" onClick={onCancel} className="p-button-secondary" />
                        </div>
                    }
                >
                    Are you sure you want to submit?
                </Dialog>
            </div>
        </div>
    );
}

export default RowForm;