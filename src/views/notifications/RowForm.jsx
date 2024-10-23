import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import setFieldTouched from "final-form-set-field-touched";
import { toast } from "react-toastify";

function RowForm({ handleSubmit, initialData }) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    // Options for the dropdown
    const targetOptions = [
        { label: "App", value: "app" },
        { label: "Email", value: "email" },
        { label: "All", value: "all" },
    ];

    const validate = (values) => {
        const errors = {};
        if (!values.message) errors.message = "Message is required";
        if (!values.target) errors.target = "Target is required";
        return errors;
    };

    const onSubmitForm = (data, form) => {
        const errors = validate(data);
        if (Object.keys(errors).length === 0) {
            setPendingData(data); // Save data for confirmation
            setShowConfirmDialog(true); // Show confirmation dialog
        } else {
            Object.keys(errors).forEach((field) => {
                form.mutators.setFieldTouched(field, true);
            });
            toast.warning("Please fill in all required fields");
        }
    };

    const onConfirm = () => {
        if (pendingData) {
            handleSubmit(pendingData);
            setPendingData(null); // Reset pending data
        }
        setShowConfirmDialog(false); // Close the dialog after confirmation
    };

    const onCancel = () => {
        setShowConfirmDialog(false); // Close the dialog without submitting
    };

    return (
        <div className="col-12 md:col-12">
            <div className="card p-fluid">
                <Form
                    onSubmit={onSubmitForm}
                    mutators={{ setFieldTouched }}
                    validate={validate}
                    initialValues={initialData}
                    render={({ handleSubmit, form, values }) => (
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                onSubmitForm(values, form);
                            }}
                        >
                            {/* Target Dropdown Field */}
                            <Field name="target">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="target">Target</label>
                                        <Dropdown {...input} options={targetOptions} id="target" placeholder="Select a target" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            {/* Message Field */}
                            <Field name="message">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="message">Message</label>
                                        <InputTextarea {...input} id="message" rows={5} className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            {/* Submit Button */}
                            <div className="d-grid gap-2">
                                <Button type="submit" label="Notify" className="p-button-primary" icon="pi pi-check" />
                            </div>
                        </form>
                    )}
                />

                {/* Confirmation Dialog */}
                <Dialog
                    header="Confirm Submission"
                    visible={showConfirmDialog}
                    style={{ width: "30vw" }}
                    footer={
                        <div>
                            <Button label="Yes" onClick={onConfirm} className="p-button-success" />
                            <Button label="No" onClick={onCancel} className="p-button-secondary" />
                        </div>
                    }
                    onHide={onCancel}
                >
                    Are you sure you want to submit this message to {pendingData?.target} Users?
                </Dialog>
            </div>
        </div>
    );
}

export default RowForm;
