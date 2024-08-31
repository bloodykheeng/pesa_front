import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import { getAssignableRoles } from "../../../services/auth/user-service";

import { addUser } from "../../../services/auth/auth-api";
import WaterIsLoading from "../../../components/general_components/WaterIsLoading";
import setFieldTouched from "final-form-set-field-touched";

import { classNames } from "primereact/utils";
import { ProgressSpinner } from "primereact/progressspinner";

import { Password } from "primereact/password";

import { FileUpload } from "primereact/fileupload";

function RowForm({ loggedInUserData, handleSubmit, initialData, ...props }) {
    const [showProjectField, setShowProjectField] = useState(false);
    console.log("loggedInUserData on user list page : ", loggedInUserData);

    console.log("testing lll fdgdsgsdf : ", initialData);

    //file
    const [photoError, setPhotoError] = useState(null);
    const [photoTouched, setPhotoTouched] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);

    useEffect(() => {
        // Reset project field when the form is closed
        if (!props.show) {
            setShowProjectField(false);
        }
    }, [props.show]);

    // const onSubmit = (values) => {
    //     createUserMutation.mutate(values);
    // };

    const validate = (values) => {
        const errors = {};

        if (!values.name) {
            errors.name = "Name is required";
        }
        if (!values.email) {
            errors.email = "Email is required";
        }
        if (!values.status) {
            errors.status = "Status is required";
        }
        if (!values.phone) {
            errors.phone = "Phone is required";
        }

        if (!values.nin) {
            errors.nin = "Nin number is required";
        }
        // Improved Password Validation
        if (!values.password) {
            errors.password = "Password is required";
        } else {
            if (values.password.length < 8) {
                errors.password = "Password must be at least 8 characters long";
            }
            if (!/[A-Z]/.test(values.password)) {
                errors.password = errors.password ? errors.password + " Must include an uppercase letter" : "Must include an uppercase letter";
            }
            if (!/[a-z]/.test(values.password)) {
                errors.password = errors.password ? errors.password + " Must include a lowercase letter" : "Must include a lowercase letter";
            }
            if (!/[0-9]/.test(values.password)) {
                errors.password = errors.password ? errors.password + " Must include a number" : "Must include a number";
            }
            if (!/[@$!%*#?&]/.test(values.password)) {
                errors.password = errors.password ? errors.password + " Must include a special character (@, $, !, %, *, #, ?, &)" : "Must include a special character (@, $, !, %, *, #, ?, &)";
            }
        }
        if (!values.role) {
            errors.role = "Role is required";
        }

        // You can add more validation logic as needed

        return errors;
    };

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    // const onSubmit = (data, form) => {
    //     // Add 'form' as an argument
    //     const errors = validate(data);
    //     if (Object.keys(errors).length === 0) {
    //         setPendingData(data);
    //         setShowConfirmDialog(true);
    //     } else {
    //         // Mark all fields as touched to show validation errors
    //         Object.keys(errors).forEach((field) => {
    //             form.mutators.setFieldTouched(field, true);
    //         });
    //         toast.warning("First fill in all required fields.");
    //     }
    // };

    const onSubmit = (data, form) => {
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

    const onConfirmSubmit = (values) => {
        handleSubmit(pendingData);
        setShowConfirmDialog(false);
    };

    const onCancelSubmit = () => {
        setShowConfirmDialog(false);
    };

    //==================== get all Roles ====================
    const getAllRolesQuery = useQuery({
        queryKey: ["roles"],
        queryFn: getAssignableRoles,
    });

    useEffect(() => {
        if (getAllRolesQuery?.isError) {
            console.log("Error fetching List of user roles data:", getAllRolesQuery?.error);
            getAllRolesQuery?.error?.response?.data?.message ? toast.error(getAllRolesQuery?.error?.response?.data?.message) : !getAllRolesQuery?.error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occurred Please Contact Admin");
        }
    }, [getAllRolesQuery?.isError]);

    if (initialData) {
        initialData = { role: initialData?.role, ...initialData };
    }

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

    return (
        <div>
            <div className="col-12 md:col-12">
                <div className="card p-fluid">
                    <Form
                        onSubmit={onSubmit}
                        initialValues={initialData}
                        validate={validate}
                        initialValuesEqual={() => true}
                        // initialValuesEqual with a function returning true prevents the form from
                        // reinitializing when the initialValues prop changes. This is useful when you
                        // want to avoid re-rendering or reinitializing the form due to changes in initial values.
                        // Be cautious using this if your initial values are meant to be dynamic and responsive
                        // to changes in your application's state.
                        mutators={{ setFieldTouched }}
                        render={({ handleSubmit, form, submitting, values }) => (
                            <form onSubmit={handleSubmit}>
                                <Field name="name">
                                    {({ input, meta }) => (
                                        <div className="p-field m-4">
                                            <label htmlFor="name">Name</label>
                                            <InputText {...input} id="name" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                            {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        </div>
                                    )}
                                </Field>
                                <Field name="email">
                                    {({ input, meta }) => (
                                        <div className="p-field m-4">
                                            <label htmlFor="email">Email</label>
                                            <InputText {...input} id="email" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                            {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        </div>
                                    )}
                                </Field>
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

                                <Field name="phone">
                                    {({ input, meta }) => (
                                        <div className="p-field m-4">
                                            <label htmlFor="phone">Phone</label>
                                            <InputText {...input} id="phone" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                            {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        </div>
                                    )}
                                </Field>

                                <Field name="nin">
                                    {({ input, meta }) => (
                                        <div className="p-field m-4">
                                            <label htmlFor="nin">Nin number</label>
                                            <InputText {...input} id="nin" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                            {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        </div>
                                    )}
                                </Field>
                                <Field name="password">
                                    {({ input, meta }) => (
                                        <div className="p-field m-4">
                                            <label htmlFor="password">Password</label>
                                            <Password
                                                {...input}
                                                id="password"
                                                toggleMask
                                                className={classNames({ "p-invalid": meta.touched && meta.error })}
                                                feedback={true} // Set to true if you want password strength indicator
                                                promptLabel="Choose a password"
                                                weakLabel="Too simple"
                                                mediumLabel="Average complexity"
                                                strongLabel="Complex password"
                                            />
                                            {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        </div>
                                    )}
                                </Field>

                                <Field name="role">
                                    {({ input, meta }) => (
                                        <div className="p-field m-4">
                                            <label htmlFor="role">Role</label>
                                            <Dropdown {...input} options={getAllRolesQuery?.data?.data?.map((role) => ({ label: role, value: role })) || []} placeholder="Select a Role" disabled={getAllRolesQuery?.isLoading} className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                            {getAllRolesQuery.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
                                            {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        </div>
                                    )}
                                </Field>

                                {/* Conditional Field Rendering based on the role */}

                                {/* FileUpload for photo with validation */}
                                <div className="p-field m-4">
                                    <label htmlFor="photo">Photo</label>
                                    <FileUpload name="photo" customUpload uploadHandler={onFileUpload} accept="image/*" maxFileSize={2097152} />
                                    {photoTouched && photoError && <small className="p-error">{photoError}</small>}
                                </div>

                                {/* Add more fields as needed */}
                                <div className="p-field m-4">
                                    <Button type="submit" label="Save" className="p-button-primary" />
                                </div>
                            </form>
                        )}
                    />
                </div>
            </div>
            <Dialog
                header="Confirm Submission"
                visible={showConfirmDialog}
                style={{ width: "30vw" }}
                onHide={onCancelSubmit}
                footer={
                    <div>
                        <Button label="Yes" onClick={onConfirmSubmit} />
                        <Button label="No" onClick={onCancelSubmit} className="p-button-secondary" />
                    </div>
                }
            >
                Are you sure you want to add this user?
            </Dialog>
        </div>
    );
}

export default RowForm;
