/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";
import { Password } from "primereact/password";

import { css } from "@emotion/react";

import { obtainToken, forgotPassword } from "../../services/auth/auth-api.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";

import CarInParkingPhoto from "./assets/istockphoto-1325361893-612x612.jpg";

import { postThirdPartyRegisterAuth, postThirdPartyLoginAuth } from "../../services/auth/auth-api.js";

import { Fieldset } from "primereact/fieldset";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import { FaGoogle } from "react-icons/fa";

//
import handleMutationError from "../../hooks/handleMutationError";

const LoginPage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoginIsLoading, setGoogleLoginIsLoading] = useState(false);

    const loginMutation = useMutation({
        mutationFn: (variables) => obtainToken(variables),
        onSuccess: (data) => {
            console.log("successfull login : xxxxx data : ", data);
            setIsLoading(false);
            queryClient.invalidateQueries([]);
            //   axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
            navigate("/");
            // window.location.reload();
        },
        onError: (error) => {
            handleMutationError(error, setIsLoading);

            console.log("login error : ", error);
        },
    });

    const onSubmit = (values) => {
        setIsLoading(true);
        console.log("Login data:", values);
        let finalValues = {
            credential: values?.email,
            password: values?.password,
        };
        loginMutation.mutate(finalValues);
    };

    const validate = (values) => {
        const errors = {};
        if (!values.email) {
            // errors.email = "Email / Phone Number is required";
            errors.email = "Email is required";
        }
        // else if (!/\S+@\S+\.\S+/.test(values.email)) {
        //   errors.email = "Email is invalid";
        // }
        if (!values.password) {
            errors.password = "Password is required";
        }
        return errors;
    };

    //Third party auth

    const thirdPartyLoginAuthMutation = useMutation({
        mutationFn: (variables) => postThirdPartyLoginAuth(variables),
        onSuccess: (data) => {
            console.log("postThirdPartyAuth data : ", data);
            setIsLoading(false);
            queryClient.invalidateQueries([]);
            //   axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
            navigate("/");
            // window.location.reload();
        },
        onError: (error) => {
            handleMutationError(error, setIsLoading);

            console.log("login error : ", error);
        },
    });

    // const handleLoginWithGoogle = useGoogleLogin({
    //   onSuccess: async (response) => {
    //     //
    //     try {
    //       setGoogleLoginIsLoading(false);
    //       console.log(response);
    //       // let responseDecoded = jwtDecode(response?.access_token);
    //       // console.log("🚀 ~ Login ~ responseDecoded:", responseDecoded);
    //       const res = await axios.get(
    //         "https://www.googleapis.com/oauth2/v3/userinfo",
    //         {
    //           headers: {
    //             Authorization: `Bearer ${response?.access_token}`
    //           }
    //         }
    //       );
    //       console.log("🚀 ~ google Login onSuccess: ~ res:", res);
    //     } catch (err) {
    //       setGoogleLoginIsLoading(false);
    //       console.log("🚀 ~ google Login ~ err:", err);
    //     }
    //   }
    // });

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
                    <div className="card p-fluid">
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <img src="assets/pesa_photos/pesa_with_green_bg.jpg" alt="logo" style={{ height: "100px" }} />
                        </div>
                        <h5 className="text-center">Login</h5>
                        <Form
                            onSubmit={onSubmit}
                            validate={validate}
                            render={({ handleSubmit, form, submitting, pristine, values }) => (
                                <form onSubmit={handleSubmit} className="p-fluid">
                                    <Field name="email">
                                        {({ input, meta }) => (
                                            <div className="m-4 p-field">
                                                {/* <label htmlFor="email">Email / Phone Number</label> */}
                                                <label htmlFor="email">Email</label>
                                                <InputText
                                                    id="email"
                                                    {...input}
                                                    type="text"
                                                    className={classNames({
                                                        "p-invalid": meta.error && meta.touched,
                                                    })}
                                                />
                                                {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                            </div>
                                        )}
                                    </Field>
                                    <Field name="password">
                                        {({ input, meta }) => (
                                            <div className="m-4 p-field">
                                                <label htmlFor="password">Password</label>
                                                <Password
                                                    id="password"
                                                    {...input}
                                                    toggleMask
                                                    type="password"
                                                    className={classNames({
                                                        "p-invalid": meta.error && meta.touched,
                                                    })}
                                                />
                                                {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                            </div>
                                        )}
                                    </Field>
                                    <div className="m-4 p-field">
                                        <Button type="submit" label={isLoading ? <ProgressSpinner style={{ width: "20px", height: "20px" }} strokeWidth="8" /> : "Login"} className="p-mt-2" disabled={submitting || isLoading} />
                                    </div>

                                    <div className="m-1 p-field">
                                        {/* <Button type="button" label="Forgot Password" className="p-button-text p-field" onClick={() => navigate("/reset-password")} /> */}
                                        <center>
                                            <p className="p-button-text p-field" style={{ display: "inline", cursor: "pointer", color: "var(--primary-color)", fontWeight: "700" }} onClick={() => navigate("/reset-password")}>
                                                Forgot Password
                                            </p>
                                        </center>
                                    </div>
                                    {/* <div className="m-1 p-field">
                                        <Button type="button" label="Create Account" className="p-button-text p-field" onClick={() => navigate("/sign-up")} />
                                    </div> */}
                                </form>
                            )}
                        />
                        {/* Google login */}
                        <Fieldset legend="Or Continue With">
                            <div className="m-1 p-field">
                                <GoogleLogin
                                    onSuccess={async (response) => {
                                        console.log(response);
                                        let responseDecoded = jwtDecode(response?.credential);
                                        console.log("🚀 ~ Login ~ responseDecoded:", responseDecoded);
                                        let dataToPost = {
                                            name: responseDecoded?.name,
                                            picture: responseDecoded?.picture,
                                            client_id: response?.clientId,
                                            provider: "google",
                                            email: responseDecoded?.email,
                                        };
                                        thirdPartyLoginAuthMutation.mutate(dataToPost);
                                    }}
                                    onError={() => {
                                        console.log("Login Failed");
                                    }}
                                />

                                {/* <Button
                  type="button"
                  label={
                    googleLoginIsLoading ? (
                      <ProgressSpinner
                        style={{ width: "20px", height: "20px" }}
                        strokeWidth="8"
                      />
                    ) : (
                      "Google"
                    )
                  }
                  icon={<FaGoogle />}
                  className="p-mt-2"
                  severity="warning"
                  text
                  raised
                  onClick={() => {
                    setGoogleLoginIsLoading(true);
                    handleLoginWithGoogle();
                  }}
                  disabled={googleLoginIsLoading}
                /> */}
                            </div>
                        </Fieldset>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default LoginPage;
