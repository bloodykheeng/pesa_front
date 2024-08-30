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

function RowForm({ handleSubmit, initialData, packageData, ...props }) {
    console.log("🚀 payements ~ RowForm ~ initialData:", initialData);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const queryClient = useQueryClient();

    const [photoError, setPhotoError] = useState(null);
    const [photoTouched, setPhotoTouched] = useState(false);

    //
    const [pakageNumber, setPackageNumber] = useState(packageData?.package_number ?? initialData?.package?.package_number);
    const [packageId, setPackageId] = useState(packageData?.id ?? initialData?.package_id);
    const [customerName, setCustomerName] = useState(packageData?.created_by?.name ?? initialData?.customer?.name);
    const [customerId, setCustomerId] = useState(packageData?.created_by?.id ?? initialData?.user_id);

    const validate = (values) => {
        const errors = {};
        if (!values.transaction_number) {
            errors.transaction_number = "Transaction Number is required.";
        }
        if (!values.payment_method) {
            errors.payment_method = "Payment Mode is required.";
        }
        // if (!values.address) {
        //     errors.address = "Address is required.";
        // }
        if (!values.amount) {
            errors.amount = "Amount is required.";
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

        if (Object.keys(errors).length === 0 && !photoError) {
            const formData = { ...data, package_id: packageId, user_id: customerId, photo: uploadedFile };
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

    const paymentMethod = [
        { label: "Cash", value: "cash" },
        { label: "MTN Mobile Money", value: "mtn_mobile_money" },
        { label: "Airtel Mobile Money", value: "airtel_mobile_money" },
        { label: "Credit Card", value: "credit_card" },
        { label: "PayPal", value: "paypal" },
        { label: "Bank Transfer", value: "bank_transfer" },
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
                            {/* <Field name="name">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="name">Name</label>
                                        <InputText {...input} id="name" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="order_number">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="order_number">Order Number</label>
                                        <InputText {...input} id="order_number" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field> */}

                            <div className="p-field m-4">
                                <label htmlFor="package_number">Package Number</label>
                                <InputText disabled id="package_number" type="text" value={pakageNumber} onChange={(e) => setPackageNumber(e.target.value)} />
                            </div>
                            <div className="p-field m-4">
                                <label htmlFor="customer_name">Customer Name</label>
                                <InputText disabled id="customer_name" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                            </div>

                            <Field name="transaction_number">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="transaction_number">Transaction Number</label>
                                        <InputText {...input} id="transaction_number" type="text" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="payment_method">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="payment_method">Payment Method</label>
                                        <Dropdown {...input} options={paymentMethod} placeholder="Select Payment Mode" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="amount">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="amount">Amount</label>
                                        <InputText {...input} id="amount" type="number" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
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
