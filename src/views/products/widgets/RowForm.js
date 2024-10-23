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

//
import { getAllElectronicCategories } from "../../../services/electronics/electronic-categories-service";
import { getAllElectronicBrands } from "../../../services/electronics/electronic-brands-service";
import { getAllElectronicTypes } from "../../../services/electronics/electronic-types-service.js";
import { getAllInventoryTypes } from "../../../services/products/inventory_types-service";

import useHandleQueryError from "../../../hooks/useHandleQueryError";
function RowForm({ handleSubmit, productCategoryBrandData, electronicTypeData, initialData, ...props }) {
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
        if (!values.category_brand && !electronicTypeData) errors.category_brand = "Product Category is required";
        if (!values.product_type && !electronicTypeData) errors.product_type = "Product Type is required";

        if (!values.inventory_type) errors.inventory_type = "Inventory Type is required";
        if (!values.electronic_category && electronicTypeData) errors.electronic_category = "Electronic Category is required";
        if (!values.electronic_brand && electronicTypeData) errors.electronic_brand = "Electronic Brand is required";
        if (!values.electronic_type && electronicTypeData) errors.electronic_type = "Electronic Type is required";

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
        initialData = { category_brand: productCategoryBrandData, electronic_category: electronicTypeData?.electronic_brand?.electronic_category, electronic_brand: electronicTypeData?.electronic_brand, electronic_type: electronicTypeData };
    }

    const getAllProductCategoryBrandsQuery = useQuery({
        queryKey: ["category_brands"],
        queryFn: getAllProductCategoryBrands,
    });

    // Use the custom hook to handle errors with useMemo on the error object
    useHandleQueryError(getAllProductCategoryBrandsQuery?.isError, getAllProductCategoryBrandsQuery?.error);

    //====================== product types========================
    const [selectedProductType, setSelectedProductType] = useState(initialData?.product_type);
    const [filteredProductType, setFilteredProductType] = useState();

    const getAllProductTypesQuery = useQuery({
        queryKey: ["product-types"],
        queryFn: getAllProductTypes,
    });

    // Use the custom hook to handle errors with useMemo on the error object
    useHandleQueryError(getAllProductTypesQuery?.isError, getAllProductTypesQuery?.error);

    //============ electronics ========================

    // State management for selected values
    const [selectedElectronicCategory, setSelectedElectronicCategory] = useState(initialData?.electronic_category ?? electronicTypeData?.electronic_brand?.electronic_category);
    const [selectedElectronicBrand, setSelectedElectronicBrand] = useState(initialData?.electronic_brand ?? electronicTypeData?.electronic_brand);
    const [selectedElectronicType, setSelectedElectronicType] = useState(initialData?.electronic_type ?? electronicTypeData);
    const [selectedInventoryType, setSelectedInventoryType] = useState(initialData?.inventory_type ?? null);

    const [filteredElectronicCategories, setFilteredElectronicCategories] = useState([]);
    const [filteredElectronicBrands, setFilteredElectronicBrands] = useState([]);
    const [filteredElectronicTypes, setFilteredElectronicTypes] = useState([]);
    const [filteredInventoryTypes, setFilteredInventoryTypes] = useState([]);

    console.log("🚀 ~sdfsdfgds RowForm ~ initialData:", initialData);

    // Queries for data fetching
    const getAllElectronicCategoriesQuery = useQuery({
        queryKey: ["electronic_categories"],
        queryFn: getAllElectronicCategories,
    });

    const getAllElectronicBrandsQuery = useQuery({
        queryKey: ["electronic_brands", "by_electronic_categories_id", selectedElectronicCategory?.id],
        queryFn: () => getAllElectronicBrands({ electronic_categories_id: selectedElectronicCategory?.id }),
        enabled: !!selectedElectronicCategory, // Only fetch if category is selected
    });

    const getAllElectronicTypesQuery = useQuery({
        queryKey: ["electronic_types", "by_electronic_brands_id", selectedElectronicBrand?.id],
        queryFn: () => getAllElectronicTypes({ electronic_brands_id: selectedElectronicBrand?.id }),
        enabled: !!selectedElectronicBrand, // Only fetch if brand is selected
    });

    const getAllInventoryTypesQuery = useQuery({
        queryKey: ["inventory_types"],
        queryFn: getAllInventoryTypes,
    });

    // Error handling
    useHandleQueryError(getAllElectronicCategoriesQuery?.isError, getAllElectronicCategoriesQuery?.error);
    useHandleQueryError(getAllElectronicBrandsQuery?.isError, getAllElectronicBrandsQuery?.error);
    useHandleQueryError(getAllElectronicTypesQuery?.isError, getAllElectronicTypesQuery?.error);

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
        console.log("🚀 ~ onSubmitForm ~ errors:", errors);
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

                            <Field name="inventory_type">
                                {({ input, meta }) => {
                                    const inventoryTypes = getAllInventoryTypesQuery?.data?.data?.data || [];
                                    const fetchInventoryTypeSuggestions = (event) => {
                                        let query = event.query.toLowerCase();
                                        let filtered = inventoryTypes.filter((type) => type?.name?.toLowerCase().includes(query));
                                        setFilteredInventoryTypes(filtered);
                                    };

                                    return (
                                        <div className="p-field m-4">
                                            <label htmlFor="inventory_type">Inventory Type</label>
                                            <AutoComplete
                                                {...input}
                                                multiple={false}
                                                suggestions={filteredInventoryTypes}
                                                completeMethod={fetchInventoryTypeSuggestions}
                                                field="name"
                                                value={selectedInventoryType}
                                                onChange={(e) => {
                                                    setSelectedInventoryType(e.value);
                                                    input.onChange(e.value);
                                                }}
                                                dropdown
                                                disabled={getAllInventoryTypesQuery?.isLoading}
                                                placeholder="Select inventory type"
                                                className={classNames({ "p-invalid": meta.touched && meta.error })}
                                            />
                                            {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                            {getAllInventoryTypesQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
                                        </div>
                                    );
                                }}
                            </Field>

                            {!electronicTypeData ? (
                                <>
                                    <Field name="category_brand">
                                        {({ input, meta }) => {
                                            const productCategoryBrands = getAllProductCategoryBrandsQuery?.data?.data?.data || [];
                                            const fetchCategoryBrandSuggestions = (event) => {
                                                let query = event.query.toLowerCase();
                                                let filtered = productCategoryBrands.filter((brand) => brand?.name?.toLowerCase().includes(query));
                                                setFilteredProductCategoryBrand(filtered);
                                            };

                                            return (
                                                <div className="p-field m-4">
                                                    <label htmlFor="category_brand">Product Category</label>
                                                    <AutoComplete
                                                        {...input}
                                                        multiple={false}
                                                        suggestions={filteredProductCategoryBrand}
                                                        completeMethod={fetchCategoryBrandSuggestions}
                                                        field="name"
                                                        value={selectedProductCategoryBrand}
                                                        onChange={(e) => {
                                                            setSelectedProductCategoryBrand(e.value);
                                                            input.onChange(e.value);

                                                            // Reset dependent fields
                                                            setSelectedProductType(null);
                                                            setFilteredProductType([]);
                                                            form.change("product_type", null);
                                                        }}
                                                        dropdown
                                                        disabled={getAllProductCategoryBrandsQuery?.isLoading}
                                                        placeholder="Select product category"
                                                        className={classNames({ "p-invalid": meta.touched && meta.error })}
                                                    />
                                                    {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                                    {getAllProductCategoryBrandsQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
                                                </div>
                                            );
                                        }}
                                    </Field>

                                    <Field name="product_type">
                                        {({ input, meta }) => {
                                            const productTypes = getAllProductTypesQuery?.data?.data?.data || [];
                                            const fetchProductTypeSuggestions = (event) => {
                                                let query = event.query.toLowerCase();
                                                let filtered = productTypes.filter((type) => type?.name?.toLowerCase().includes(query));
                                                setFilteredProductType(filtered);
                                            };

                                            return (
                                                <div className="p-field m-4">
                                                    <label htmlFor="product_type">Product Type</label>
                                                    <AutoComplete
                                                        {...input}
                                                        multiple={false}
                                                        suggestions={filteredProductType}
                                                        completeMethod={fetchProductTypeSuggestions}
                                                        field="name"
                                                        value={selectedProductType}
                                                        onChange={(e) => {
                                                            setSelectedProductType(e.value);
                                                            input.onChange(e.value);
                                                        }}
                                                        dropdown
                                                        disabled={getAllProductTypesQuery?.isLoading}
                                                        placeholder="Select product type"
                                                        className={classNames({ "p-invalid": meta.touched && meta.error })}
                                                    />
                                                    {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                                    {getAllProductTypesQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
                                                </div>
                                            );
                                        }}
                                    </Field>
                                </>
                            ) : (
                                <>
                                    {/* ====================================  electronics=============================== */}
                                    <Field name="electronic_category">
                                        {({ input, meta }) => {
                                            const electronicCategories = getAllElectronicCategoriesQuery?.data?.data?.data || [];
                                            const fetchElectronicCategorySuggestions = (event) => {
                                                let query = event.query.toLowerCase();
                                                let filtered = electronicCategories.filter((category) => category?.name?.toLowerCase().includes(query));
                                                setFilteredElectronicCategories(filtered);
                                            };

                                            return (
                                                <div className="p-field m-4">
                                                    <label htmlFor="electronic_category">Electronic Category</label>
                                                    <AutoComplete
                                                        {...input}
                                                        multiple={false}
                                                        suggestions={filteredElectronicCategories}
                                                        completeMethod={fetchElectronicCategorySuggestions}
                                                        field="name"
                                                        value={selectedElectronicCategory}
                                                        onChange={(e) => {
                                                            setSelectedElectronicCategory(e.value);
                                                            input.onChange(e.value);

                                                            // Reset dependent fields
                                                            setSelectedElectronicBrand(null);
                                                            setFilteredElectronicBrands([]);
                                                            setSelectedElectronicType(null);
                                                            setFilteredElectronicTypes([]);
                                                            form.change("electronic_brand", null);
                                                            form.change("electronic_type", null);
                                                        }}
                                                        dropdown
                                                        disabled={getAllElectronicCategoriesQuery?.isLoading}
                                                        placeholder="Select electronic category"
                                                        className={classNames({ "p-invalid": meta.touched && meta.error })}
                                                    />
                                                    {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                                    {getAllElectronicCategoriesQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
                                                </div>
                                            );
                                        }}
                                    </Field>

                                    <Field name="electronic_brand">
                                        {({ input, meta }) => {
                                            const electronicBrands = getAllElectronicBrandsQuery?.data?.data?.data || [];
                                            const fetchElectronicBrandSuggestions = (event) => {
                                                let query = event.query.toLowerCase();
                                                let filtered = electronicBrands.filter((brand) => brand?.name?.toLowerCase().includes(query));
                                                setFilteredElectronicBrands(filtered);
                                            };

                                            return (
                                                <div className="p-field m-4">
                                                    <label htmlFor="electronic_brand">Electronic Brand</label>
                                                    <AutoComplete
                                                        {...input}
                                                        multiple={false}
                                                        suggestions={filteredElectronicBrands}
                                                        completeMethod={fetchElectronicBrandSuggestions}
                                                        field="name"
                                                        value={selectedElectronicBrand}
                                                        onChange={(e) => {
                                                            setSelectedElectronicBrand(e.value);
                                                            input.onChange(e.value);

                                                            // Reset dependent field
                                                            setSelectedElectronicType(null);
                                                            setFilteredElectronicTypes([]);
                                                            form.change("electronic_type", null);
                                                        }}
                                                        dropdown
                                                        disabled={getAllElectronicBrandsQuery?.isLoading || !selectedElectronicCategory}
                                                        placeholder="Select electronic brand"
                                                        className={classNames({ "p-invalid": meta.touched && meta.error })}
                                                    />
                                                    {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                                    {getAllElectronicBrandsQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
                                                </div>
                                            );
                                        }}
                                    </Field>

                                    <Field name="electronic_type">
                                        {({ input, meta }) => {
                                            const electronicTypes = getAllElectronicTypesQuery?.data?.data?.data || [];
                                            const fetchElectronicTypeSuggestions = (event) => {
                                                let query = event.query.toLowerCase();
                                                let filtered = electronicTypes.filter((type) => type?.name?.toLowerCase().includes(query));
                                                setFilteredElectronicTypes(filtered);
                                            };

                                            return (
                                                <div className="p-field m-4">
                                                    <label htmlFor="electronic_type">Electronic Type</label>
                                                    <AutoComplete
                                                        {...input}
                                                        multiple={false}
                                                        suggestions={filteredElectronicTypes}
                                                        completeMethod={fetchElectronicTypeSuggestions}
                                                        field="name"
                                                        value={selectedElectronicType}
                                                        onChange={(e) => {
                                                            setSelectedElectronicType(e.value);
                                                            input.onChange(e.value);
                                                        }}
                                                        dropdown
                                                        disabled={getAllElectronicTypesQuery?.isLoading || !selectedElectronicBrand}
                                                        placeholder="Select electronic type"
                                                        className={classNames({ "p-invalid": meta.touched && meta.error })}
                                                    />
                                                    {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                                    {getAllElectronicTypesQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
                                                </div>
                                            );
                                        }}
                                    </Field>
                                </>
                            )}

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
