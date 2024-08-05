/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { Card } from "primereact/card";

import { useNavigate } from "react-router-dom";
import { signUp } from "../../services/auth/auth-api.js";
import { AutoComplete } from "primereact/autocomplete";

import CarInParkingPhoto from "./assets/d09e614357764f045db8da8fd59e7088.avif";
import { css } from "@emotion/react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { getAllVendors, getVendorById, postVendor, updateVendor, deleteVendorById } from "../../services/vendors/vendors-service.js";

import { postThirdPartyRegisterAuth } from "../../services/auth/auth-api.js";

import { Fieldset } from "primereact/fieldset";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

//
import { Calendar } from "primereact/calendar";
import moment from "moment";

const SignUpPage = () => {
    const navigate = useNavigate();
    const [showTerms, setShowTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const queryClient = useQueryClient();

    const creactMutation = useMutation({
        mutationFn: signUp,
        onSuccess: () => {
            setIsLoading(false);
            // queryClient.invalidateQueries(["spare-parts"]);
            toast.success(["Vendor", "Seller", "Inspector"].includes(selectedRole) ? "Account Information Submitted Successfully Wait Until Admin will verify your account " : "Account Created Successfully");
        },
        onError: (error) => {
            setIsLoading(false);
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        },
    });

    const onSubmit = (values) => {
        console.log("Signup data:", values);
        let finalData = {
            ...values,
            status: selectedRole == "Buyer" ? "active" : "pending",
        };
        setIsLoading(true);
        creactMutation.mutate(finalData);
    };

    const validate = (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = "Name is required";
        }
        if (!values.role) {
            errors.role = "role is required";
        }

        if (!values.dateOfBirth) {
            errors.dateOfBirth = "Date of Birth is required";
        }

        if (["Vendor", "Seller"].includes(selectedRole)) {
            if (!values.phone_number) {
                errors.phone_number = "Phone number is required";
            } else if (!/^\+?\d{8,15}$/.test(values.phone_number)) {
                errors.phone_number = "Phone number is invalid";
            }

            if (!values.nin_no) {
                errors.nin_no = "NIN Number is required";
            }
            // else if (!/^\d{14}[A-Z]$/.test(values.nin_no)) {
            //   errors.nin_no = "NIN number is invalid";
            // }
        }

        if (!values.vendor_id && values?.role == "Vendor") {
            errors.vendor_id = "Vendor is required";
        }

        if (!values.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Email is invalid";
        }
        if (!values.password) {
            errors.password = "Password is required";
        }
        if (!values.confirm) {
            errors.confirm = "Confirm password is required";
        } else if (values.confirm !== values.password) {
            errors.confirm = "Passwords do not match";
        }
        if (!values.agree_to_terms) {
            errors.agree_to_terms = "You must agree to the terms";
        }
        return errors;
    };

    const handleTermsDialogToggle = (e) => {
        // e.preventDefault();
        setShowTerms(!showTerms);
    };

    const passwordFooter = (
        <React.Fragment>
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 mt-0 ml-2" style={{ lineHeight: "1.5" }}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </React.Fragment>
    );

    //==================== Vendors ============
    const [selectedVendor, setSelectedVendor] = useState();
    const [filteredVendor, setFilteredVendor] = useState();

    const getListOfVendors = useQuery({
        queryKey: ["vendors"],
        queryFn: () => getAllVendors(),
    });

    useEffect(() => {
        if (getListOfVendors?.isError) {
            console.log("Error fetching vendors :", getListOfVendors?.error);
            getListOfVendors?.error?.response?.data?.message ? toast.error(getListOfVendors?.error?.response?.data?.message) : !getListOfVendors?.error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        }
    }, [getListOfVendors?.isError]);

    //Third party auth

    const thirdPartyRegisterAuthMutation = useMutation({
        mutationFn: (variables) => postThirdPartyRegisterAuth(variables),
        onSuccess: (data) => {
            console.log("postThirdPartyAuth data : ", data);
            setIsLoading(false);
            queryClient.invalidateQueries([]);
            //   axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
            navigate("/");
            // window.location.reload();
        },
        onError: (error) => {
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
            setIsLoading(false);

            console.log("login error : ", error);
        },
    });

    return (
        <Card>
            <div className="form-demo" style={{ height: "100vh", zIndex: 2, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", overflow: "auto" }}>
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
                <div
                    className="flex align-items-center "
                    style={{
                        zIndex: 2,
                        position: "relative",
                        flexWrap: "wrap",
                        justifyContent: "space-around",
                    }}
                >
                    <div className="card">
                        <h5 className="text-center">Sign Up</h5>
                        <Form
                            onSubmit={onSubmit}
                            validate={validate}
                            render={({ handleSubmit, form, submitting, values }) => (
                                <form onSubmit={handleSubmit} className="m-4 p-fluid">
                                    <Field name="name">
                                        {({ input, meta }) => (
                                            <div className="m-4 p-field">
                                                <label htmlFor="name">Name</label>
                                                <InputText {...input} id="name" autoFocus />
                                                {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                            </div>
                                        )}
                                    </Field>
                                    <Field name="email">
                                        {({ input, meta }) => (
                                            <div className="m-4 p-field">
                                                <label htmlFor="email">Email</label>
                                                <InputText {...input} id="email" type="email" />
                                                {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                            </div>
                                        )}
                                    </Field>

                                    {/* <Field name="dateOfBirth">
                    {({ input, meta }) => (
                      <div className="p-field m-4">
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <Calendar
                          {...input}
                          touchUI
                          hideOnDateTimeSelect={true}
                          value={input.value ? new Date(input.value) : null} // Set the Calendar value
                          showIcon
                          showTime
                          dateFormat="dd-mm-yy"
                          hourFormat="24"
                          className={classNames({
                            "p-invalid": meta.touched && meta.error
                          })}
                          onSelect={(e) => {
                            // Format the date when selected and update the input value
                            const formattedDate = moment(e.value).format(
                              "YYYY-MM-DD HH:mm:ss"
                            );
                            input.onChange(formattedDate);
                          }}
                          onChange={(e) => {
                            // Update the input field only if the value is a valid date
                            if (e.value instanceof Date) {
                              const formattedDate = moment(e.value).format(
                                "YYYY-MM-DD HH:mm:ss"
                              );
                              input.onChange(formattedDate);
                            }
                          }}
                        />
                        {meta.error && meta.touched && (
                          <small className="p-error">{meta.error}</small>
                        )}
                      </div>
                    )}
                  </Field> */}

                                    <Field name="dateOfBirth">
                                        {({ input, meta }) => (
                                            <div className="p-field m-4">
                                                <label htmlFor="dateOfBirth">Date of Birth</label>
                                                <Calendar
                                                    {...input}
                                                    touchUI
                                                    hideOnDateTimeSelect={true}
                                                    value={input.value ? new Date(input.value) : null} // Set the Calendar value
                                                    showIcon
                                                    dateFormat="dd-mm-yy"
                                                    className={classNames({
                                                        "p-invalid": meta.touched && meta.error,
                                                    })}
                                                    onSelect={(e) => {
                                                        // Format the date when selected and update the input value
                                                        const formattedDate = moment(e.value).format("YYYY-MM-DD");
                                                        input.onChange(formattedDate);
                                                    }}
                                                    onChange={(e) => {
                                                        // Update the input field only if the value is a valid date
                                                        if (e.value instanceof Date) {
                                                            const formattedDate = moment(e.value).format("YYYY-MM-DD");
                                                            input.onChange(formattedDate);
                                                        }
                                                    }}
                                                />
                                                {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                            </div>
                                        )}
                                    </Field>

                                    <Field name="role">
                                        {({ input, meta }) => (
                                            <div className="m-4 p-field">
                                                <label htmlFor="role">Role</label>
                                                <Dropdown
                                                    value={selectedRole}
                                                    options={[
                                                        { label: "Buyer", value: "Buyer" },
                                                        { label: "Seller", value: "Seller" },
                                                        { label: "Vendor", value: "Vendor" },
                                                        { label: "Inspector", value: "Inspector" },
                                                    ]}
                                                    onChange={(e) => {
                                                        setSelectedRole(e.value);
                                                        input.onChange(e.value);
                                                        // Additional actions can be performed here based on the new role
                                                        setSelectedVendor(null);
                                                        form.change("vendor_id", null);
                                                        console.log("Selected role:", e.value);
                                                    }}
                                                    placeholder="Select a Role"
                                                    id="role"
                                                />

                                                {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                            </div>
                                        )}
                                    </Field>

                                    {["Vendor"].includes(selectedRole) && (
                                        <Field name="vendor_id">
                                            {({ input, meta }) => (
                                                <div className="m-4 p-field">
                                                    <label htmlFor="vendor_id">Vendor</label>
                                                    <AutoComplete
                                                        value={selectedVendor?.name || ""}
                                                        suggestions={filteredVendor}
                                                        completeMethod={(e) => {
                                                            const results = getListOfVendors.data?.data?.filter((item) => {
                                                                return item.name.toLowerCase().includes(e.query.toLowerCase());
                                                            });
                                                            setFilteredVendor(results);
                                                        }}
                                                        field="name"
                                                        dropdown={true}
                                                        onChange={(e) => {
                                                            if (typeof e.value === "string") {
                                                                // Update the display value to the typed string and reset the selected item
                                                                setSelectedVendor({ name: e.value });
                                                                input.onChange("");
                                                            } else if (typeof e.value === "object" && e.value !== null) {
                                                                // Update the selected item and set the form state with the selected items's ID
                                                                setSelectedVendor(e.value);
                                                                input.onChange(e.value.id);
                                                                // Clear the values of the children
                                                                // setSelectedFinancialYear(null);
                                                                // form.change("utility_id", undefined);
                                                            }
                                                        }}
                                                        id="vendor_id"
                                                        selectedItemTemplate={(value) => <div>{value ? value.value : "Select a Department"}</div>}
                                                        disabled={getListOfVendors?.isLoading}
                                                    />
                                                    {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                                    {getListOfVendors.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
                                                </div>
                                            )}
                                        </Field>
                                    )}

                                    <Field name="phone_number">
                                        {({ input, meta }) => (
                                            <div className="m-4 p-field">
                                                <label htmlFor="phone_number">Phone Number</label>
                                                <InputText {...input} id="phone_number" />
                                                {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                            </div>
                                        )}
                                    </Field>

                                    <Field name="nin_no">
                                        {({ input, meta }) => (
                                            <div className="m-4 p-field">
                                                <label htmlFor="nin_no">NIN Number</label>
                                                <InputText {...input} id="nin_no" />
                                                {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                            </div>
                                        )}
                                    </Field>

                                    <Field name="password">
                                        {({ input, meta }) => (
                                            <div className="m-4 p-field">
                                                <label htmlFor="password">Password</label>
                                                <Password {...input} toggleMask id="password" type="password" footer={passwordFooter} />
                                                {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                            </div>
                                        )}
                                    </Field>
                                    <Field name="confirm">
                                        {({ input, meta }) => (
                                            <div className="m-4 p-field">
                                                <label htmlFor="confirm">Confirm Password</label>
                                                <Password {...input} id="confirm" type="password" toggleMask />
                                                {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                            </div>
                                        )}
                                    </Field>
                                    <Field name="agree_to_terms" type="checkbox">
                                        {({ input, meta }) => (
                                            <div className="m-4 p-field-checkbox">
                                                <Checkbox inputId="agree_to_terms" {...input} checked={input?.checked ? true : false} style={{ marginRight: "1rem" }} />
                                                <label htmlFor="agree_to_terms" onClick={handleTermsDialogToggle} style={{ cursor: "pointer", color: "tomato" }}>
                                                    I agree to the <a>Terms and Conditions</a>
                                                </label>{" "}
                                                <br />
                                                {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                            </div>
                                        )}
                                    </Field>
                                    <div className="m-4 p-field">
                                        {" "}
                                        <Button type="submit" label={isLoading ? <ProgressSpinner style={{ width: "20px", height: "20px" }} strokeWidth="8" /> : "Sign Up"} className="p-mt-2" disabled={submitting || isLoading} />
                                    </div>
                                    <div className="m-4 p-field">
                                        {" "}
                                        <p className="p-mt-2">
                                            Already have an account?{" "}
                                            <span style={{ color: "tomato", cursor: "pointer" }} onClick={() => navigate("/login")}>
                                                Login
                                            </span>
                                        </p>
                                    </div>
                                </form>
                            )}
                        />

                        <Dialog header="Terms and Conditions" visible={showTerms} style={{ minWidth: "50vw" }} maximizable onHide={handleTermsDialogToggle}>
                            <p>My Car terms and conditions content</p>
                        </Dialog>
                    </div>

                    {/* Google login */}
                    {/* <div className="m-1 p-field">
            <Fieldset legend="Or Continue With">
              <div className="m-1 p-field">
                <GoogleLogin
                  theme={theme === "dark" ? "filled_blue" : "outline"}
                  onSuccess={async (response) => {
                    console.log(response);
                    let responseDecoded = jwtDecode(response?.credential);
                    console.log(
                      "🚀 ~ Login ~ responseDecoded:",
                      responseDecoded
                    );
                    let dataToPost = {
                      name: responseDecoded?.name,
                      picture: responseDecoded?.picture,
                      client_id: response?.clientId,
                      provider: "google",
                      email: responseDecoded?.email
                    };
                    thirdPartyRegisterAuthMutation.mutate(dataToPost);
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </div>
            </Fieldset>
          </div> */}
                </div>
            </div>

            {isLoading && (
                <center>
                    <ProgressSpinner
                        style={{
                            width: "50px",
                            height: "50px",
                            borderWidth: "8px", // Border thickness
                            borderColor: "blue", // Border color
                            animationDuration: "1s",
                        }}
                        strokeWidth="8"
                        animationDuration="1s"
                    />
                </center>
            )}
        </Card>
    );
};

export default SignUpPage;
