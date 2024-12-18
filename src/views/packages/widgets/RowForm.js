import React, { useState } from "react";
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
import { AutoComplete } from "primereact/autocomplete";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DeleteIcon from "@mui/icons-material/Delete";
import { FileUpload } from "primereact/fileupload";

function RowForm({ handleSubmit, initialData, ...props }) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const queryClient = useQueryClient();

    const [photoError, setPhotoError] = useState(null);
    const [photoTouched, setPhotoTouched] = useState(false);

    const validate = (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = "Name is required";
        }

        if (!values.package_number) {
            errors.package_number = "Package number is required";
        }

        if (!values.delivery_status) {
            errors.delivery_status = "Delivery Status is required";
        }

        if (!values.pickup) {
            errors.pickup = "Pickup location is required";
        }

        if (!values.destination) {
            errors.destination = "Destination is required";
        }

        if (!values.extraInfo) {
            errors.extraInfo = "Extra Info is required";
        }

        return errors;
    };

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
            toast.warning("Please fill in all required fields");
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

    //======
    // Delivery status options
    const deliveryStatuses = [
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Transit", value: "transit" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
    ];

    const paymentStatuses = [
        { label: "Pending", value: "pending" },
        { label: "Paid", value: "Paid" },
        { label: "Cancelled", value: "cancelled" },
    ];

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

                            {/* Order Number Field */}
                            <Field name="package_number">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="package_number">Package Number</label>
                                        <InputText {...input} id="package_number" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            {/* Status Field */}
                            <Field name="delivery_status">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="delivery_status">Delivery Status</label>
                                        <Dropdown
                                            {...input}
                                            options={deliveryStatuses}
                                            placeholder="Select a Delivery Status"
                                            value={input.value} // Ensure Dropdown receives the correct value
                                            onChange={(e) => input.onChange(e.value)} // Handle dropdown change
                                            className={classNames({ "p-invalid": meta.touched && meta.error })}
                                        />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="payment_status">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="payment_status">Payment Status</label>
                                        <Dropdown {...input} options={paymentStatuses} placeholder="Select Payment Status" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            {/* Pickup Field */}
                            <Field name="pickup">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="pickup">Pickup</label>
                                        <InputText {...input} id="pickup" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            {/* Destination Field */}
                            <Field name="destination">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="destination">Destination</label>
                                        <InputText {...input} id="destination" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="amount_paid">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="amount_paid">Amount Paid</label>
                                        <InputText {...input} id="amount_paid" type="number" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="charged_amount">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="charged_amount">Charged Amount</label>
                                        <InputText {...input} id="charged_amount" type="number" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            {/* Extra Info Field */}
                            <Field name="extraInfo">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="extraInfo">Extra Info</label>
                                        <InputTextarea {...input} rows={5} cols={30} id="extraInfo" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            {/* FileUpload for photo with validation */}
                            {/* <div className="p-field m-4">
                                <label htmlFor="photo">Photo</label>
                                <FileUpload name="photo" customUpload uploadHandler={onFileUpload} accept="image/*" maxFileSize={2097152} />
                                {photoTouched && photoError && <small className="p-error">{photoError}</small>}
                            </div> */}
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
