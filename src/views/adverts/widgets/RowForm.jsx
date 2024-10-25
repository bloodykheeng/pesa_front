import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import setFieldTouched from "final-form-set-field-touched";
import { toast } from "react-toastify";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";

//
import { FileUpload } from "primereact/fileupload";

function RowForm({ handleSubmit, initialData }) {
    //file
    const [photoError, setPhotoError] = useState(null);
    const [photoTouched, setPhotoTouched] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const validate = (values) => {
        const errors = {};

        // Title Validation
        if (!values.title) errors.title = "Title is required";

        // Details Validation (optional, add validation if necessary)
        if (!values.details) errors.details = "Details are required";

        // Status Validation
        if (!values.status) errors.status = "Status is required";

        // Start Date and End Date Validation
        if (!values.start_date) errors.start_date = "Start date is required";
        if (!values.end_date) errors.end_date = "End date is required";
        else if (values.start_date && values.end_date && values.start_date > values.end_date) {
            errors.end_date = "End date must be after start date";
        }

        return errors;
    };

    // const onSubmitForm = (data, form) => {
    //     const errors = validate(data);
    //     if (Object.keys(errors).length === 0) {
    //         setPendingData(data);
    //         setShowConfirmDialog(true);
    //     } else {
    //         Object.keys(errors).forEach((field) => {
    //             form.mutators.setFieldTouched(field, true);
    //         });
    //         toast.warning("Please fill in all required fields");
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

    //file

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

    const statusOptions = [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" },
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
                                onSubmitForm(values, form);
                            }}
                        >
                            {/* Title Field */}
                            <Field name="title">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="title">Title</label>
                                        <InputText {...input} id="title" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            {/* Details Field */}
                            <Field name="details">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="details">Details</label>
                                        <InputTextarea {...input} id="details" rows={5} className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            {/* Status Dropdown */}
                            <Field name="status">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="status">Status</label>
                                        <Dropdown {...input} id="status" options={statusOptions} placeholder="Select a Status" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            {/* Start Date Field */}
                            <Field name="start_date">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="start_date">Start Date</label>
                                        <Calendar {...input} id="start_date" showTime className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            {/* End Date Field */}
                            <Field name="end_date">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="end_date">End Date</label>
                                        <Calendar {...input} id="end_date" showTime className={classNames({ "p-invalid": meta.touched && meta.error })} />
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
