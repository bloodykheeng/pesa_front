import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import setFieldTouched from "final-form-set-field-touched";
import { toast } from "react-toastify";

function RowForm({ handleSubmit, initialData }) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const validate = (values) => {
        const errors = {};
        if (!values.question) errors.question = "Question is required";
        if (!values.answer) errors.answer = "Answer is required";
        return errors;
    };

    const onSubmitForm = (data, form) => {
        const errors = validate(data);
        if (Object.keys(errors).length === 0) {
            setPendingData(data);
            setShowConfirmDialog(true);
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
            setPendingData(null);
        }
        setShowConfirmDialog(false);
    };

    const onCancel = () => {
        setShowConfirmDialog(false);
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
                                onSubmitForm(values, form);
                            }}
                        >
                            <Field name="question">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="question">Question</label>
                                        <InputTextarea {...input} id="question" rows={5} className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="answer">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="answer">Answer</label>
                                        <InputTextarea {...input} id="answer" rows={5} className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

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
