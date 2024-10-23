/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { obtainToken, forgotPassword } from "../../services/auth/auth-api.js";
import { toast } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import CarInParkingPhoto from "./assets/istockphoto-1133561369-612x612.jpg";

import { css } from "@emotion/react";

//
import handleMutationError from "../../hooks/handleMutationError";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const forgotPasswordMutation = useMutation({
        mutationFn: forgotPassword,
        onSuccess: (data) => {
            console.log("🚀 ~ ResetPasswordPage ~ data:", data);
            setIsLoading(false);
            data?.data?.success ? toast.success(data?.data?.message) : toast.warning(data?.data?.message);
        },
        onError: (error) => {
            setIsLoading(false);
            handleMutationError(error, setIsLoading);
        },
    });

    const onSubmit = (values) => {
        setIsLoading(true);
        console.log("Request to reset password for:", values.email);
        forgotPasswordMutation.mutate(values);
        // Here you might call an API to handle the password reset request
    };

    const validate = (values) => {
        const errors = {};
        if (!values.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Email is invalid";
        }
        return errors;
    };

    return (
        <Card>
            <div className="form-demo auth-form" style={{ height: "100vh", zIndex: 2, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", overflow: "auto" }}>
                {/* <div
                    css={css`
                        position: absolute;

                        width: 100%;
                        height: 100%;
                        background: url(${CarInParkingPhoto});
                        background-size: cover;
                        opacity: 0.1;
                    `}
                ></div> */}
                <div className="flex justify-content-center" style={{ zIndex: 2, position: "relative" }}>
                    <div className="card" style={{ minWidth: "400px" }}>
                        <h5 className="text-center">Reset Password</h5>
                        <Form
                            onSubmit={onSubmit}
                            validate={validate}
                            render={({ handleSubmit, form, submitting, pristine, values }) => (
                                <form onSubmit={handleSubmit} className="p-fluid">
                                    <Field name="email">
                                        {({ input, meta }) => (
                                            <div className="m-4 p-field">
                                                <label htmlFor="email">Email</label>
                                                <InputText
                                                    {...input}
                                                    id="email"
                                                    type="email"
                                                    className={classNames({
                                                        "p-invalid": meta.error && meta.touched,
                                                    })}
                                                />
                                                {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                            </div>
                                        )}
                                    </Field>
                                    <div className="m-4 p-field">
                                        {" "}
                                        <Button type="submit" label={isLoading ? <ProgressSpinner style={{ width: "20px", height: "20px" }} strokeWidth="8" /> : "Send Reset Link"} className="p-mt-2" disabled={submitting || isLoading} />
                                    </div>
                                    <div className="m-4 p-field">
                                        {" "}
                                        <p className="p-mt-2">
                                            Remembered your password?{" "}
                                            <span style={{ color: "var(--primary-color)", cursor: "pointer" }} onClick={() => navigate("/login")}>
                                                Login
                                            </span>
                                        </p>{" "}
                                    </div>
                                </form>
                            )}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ResetPasswordPage;
