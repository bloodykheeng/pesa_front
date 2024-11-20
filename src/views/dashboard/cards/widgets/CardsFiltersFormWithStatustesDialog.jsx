import React, { useEffect, useState, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { TextField, Autocomplete, Grid, Stack, InputLabel, CircularProgress, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";

import { Button } from "primereact/button";
import * as Yup from "yup";

const CardsFiltersFormWithStatustesDialog = ({ onSubmit, filtersFormInitialDataValues, setFiltersFormInitialDataValues, showFiltersFormDialog, setShowFiltersFormDialog }) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showResetConfirmDialog, setShowResetConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    // Queries and useEffects

    //hndle form submit
    const handleFormSubmit = (values) => {
        // setPendingData(values);
        // setShowConfirmDialog(true);

        onSubmit(values);
        setShowFiltersFormDialog(false);
    };

    const handleConfirm = () => {
        if (pendingData) {
            onSubmit(pendingData);
            setPendingData(null);
            setShowFiltersFormDialog(false);
        }
        setShowConfirmDialog(false);
    };

    const handleCancel = () => {
        setShowConfirmDialog(false);
    };

    //

    const statusOptions = [
        { id: 1, label: "Pending", value: "PENDING" },
        { id: 2, label: "Processing", value: "PROCESSING" },
        { id: 3, label: "Transit", value: "TRANSIT" },
        { id: 4, label: "Delivered", value: "DELIVERED" },
        { id: 5, label: "Cancelled", value: "CANCELLED" },
    ];

    const deliveryStatusesOptions = [
        { id: 1, label: "Pending", value: "pending" },
        { id: 2, label: "Processing", value: "processing" },
        { id: 3, label: "Transit", value: "transit" },
        { id: 4, label: "Delivered", value: "delivered" },
        { id: 5, label: "Received", value: "received" },
        { id: 6, label: "Cancelled", value: "cancelled" },
    ];

    const paymentStatusesOptions = [
        { id: 1, label: "Pending", value: "pending" },
        { id: 2, label: "Paid", value: "Paid" },
        { id: 3, label: "Cancelled", value: "cancelled" },
    ];

    //-=========== handle reset ===============
    const handleReset = (resetForm) => {
        // setShowResetConfirmDialog(true);

        resetForm();
        setFiltersFormInitialDataValues({
            startDate: moment().subtract(30, "days").startOf("day").format("YYYY-MM-DD"),
            endDate: moment().format("YYYY-MM-DD"), // Set to now
            // statuses: [{ id: 1, label: "Pending", value: "PENDING" }],
            deliveryStatuses: [{ id: 1, label: "Pending", value: "pending" }],
            paymentStatuses: [],
            // dataLimitNumber: null,
            productTypes: [],
            productCategories: [],
            productCategoryBrands: [],
            products: [],
        });
        // setShowResetConfirmDialog(false);
    };

    const handleConfirmReset = (resetForm) => {
        resetForm();
        setFiltersFormInitialDataValues({
            startDate: moment().subtract(30, "days").startOf("day").format("YYYY-MM-DD"),
            endDate: moment().format("YYYY-MM-DD"), // Set to now
            // statuses: [{ id: 1, label: "Pending", value: "PENDING" }],
            deliveryStatuses: [],
            paymentStatuses: [{ id: 1, label: "Pending", value: "pending" }],
            productTypes: [],
            productCategories: [],
            productCategoryBrands: [],
            products: [],
        });
        setShowResetConfirmDialog(false);
    };

    const handleCancelReset = () => {
        setShowResetConfirmDialog(false);
    };

    // Validation schema
    // const validationSchema = Yup.object()
    //     .shape({
    //         startDate: Yup.date().required(),
    //         endDate: Yup.date()
    //             .nullable()
    //             .when("startDate", (startDate, schema) => (startDate ? schema.required("End date is required when start date is chosen") : schema))
    //             .test("is-after-start-date", "End date cannot be before start date", function (value) {
    //                 const { startDate } = this.parent;
    //                 return !startDate || !value || new Date(startDate) <= new Date(value);
    //             }),
    //         statuses: Yup.array(),
    //         productCategories: Yup.array(),
    //         productCategoryBrand: Yup.array(),
    //         products: Yup.array(),
    //     })
    //     });
    // Custom validation function
    const validate = (values) => {
        const errors = {};

        // Date validation
        if (values.startDate && !values.endDate) {
            errors.endDate = "End date is required when start date is chosen";
        }
        if (values.startDate && values.endDate && new Date(values.startDate) > new Date(values.endDate)) {
            errors.endDate = "End date cannot be before start date";
        }

        // if (values.startDate) errors.agents = "start date  is required";

        // if (!Array.isArray(values.agents) || values.agents.length === 0) errors.agents = "Agent is required";
        // Ensure at least one field is filled and check if fields are arrays
        if ((!Array.isArray(values.deliveryStatuses) || values.deliveryStatuses.length === 0) && (!Array.isArray(values.paymentStatuses) || values.paymentStatuses.length === 0) && !values.startDate && !values.endDate) {
            errors.form = "At least one field must be filled";
        }

        return errors;
    };

    return (
        <Dialog
            header="Filters"
            visible={showFiltersFormDialog}
            maximizable
            footer={() => (
                <div>
                    <Button label="Cancel" icon="pi pi-times" onClick={() => setShowFiltersFormDialog(false)} className="p-button-text" />
                    {/* <Button label="Submit" icon="pi pi-check" onClick={handleSubmit} /> */}
                </div>
            )}
            onHide={() => setShowFiltersFormDialog(false)}
            style={{ width: "60vw" }}
        >
            <Formik
                initialValues={filtersFormInitialDataValues}
                onSubmit={handleFormSubmit}
                // validationSchema={validationSchema}
                validate={validate}
                // validateOnMount
                // initialTouched={{
                //     startDate: true,
                //     endDate: true,
                //     statuses: true,
                //     productCategories: true,
                //     productCategoryBrand: true,
                //     products: true,
                // }}
            >
                {({ values, setFieldValue, resetForm, errors, touched, isSubmitting }) => (
                    <Form>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <Grid item xs={12} md={6} lg={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="startDate">Start Date</InputLabel>
                                        <Field name="startDate">
                                            {({ field }) => (
                                                <DatePicker
                                                    label="Start Date"
                                                    format="DD/MM/YYYY"
                                                    views={["year", "month", "day"]}
                                                    value={field.value ? moment(field.value, "YYYY-MM-DD") : null}
                                                    onChange={(value) => setFieldValue("startDate", value ? moment(value).format("YYYY-MM-DD") : null)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            error={Boolean(touched.startDate && errors.startDate)}
                                                            // helperText={touched.startDate && errors.startDate ? errors.startDate : ""}
                                                        />
                                                    )}
                                                />
                                            )}
                                        </Field>
                                        <ErrorMessage name="startDate" component="div" style={{ color: "red" }} />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} md={6} lg={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="endDate">End Date</InputLabel>
                                        <Field name="endDate">
                                            {({ field }) => (
                                                <DatePicker
                                                    label="End Date"
                                                    format="DD/MM/YYYY"
                                                    views={["year", "month", "day"]}
                                                    value={field.value ? moment(field.value, "YYYY-MM-DD") : null}
                                                    onChange={(value) => setFieldValue("endDate", value ? moment(value).format("YYYY-MM-DD") : null)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            error={Boolean(touched.endDate && errors.endDate)}
                                                            // helperText={touched.endDate && errors.endDate ? errors.endDate : ""}
                                                        />
                                                    )}
                                                />
                                            )}
                                        </Field>
                                        <ErrorMessage name="endDate" component="div" style={{ color: "red" }} />
                                    </Stack>
                                </Grid>
                            </LocalizationProvider>

                            {/* Status Multiple Select */}
                            {/* <Grid item xs={12} md={6} lg={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="statuses">Statuses</InputLabel>
                                    <Field name="statuses">
                                        {({ field }) => (
                                            <Autocomplete
                                                //isOptionEqualToValue helps to define how comparison is gonna be made
                                                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                multiple
                                                options={statusOptions}
                                                getOptionLabel={(option) => option.label}
                                                value={Array.isArray(field.value) ? field.value : []}
                                                onChange={(event, newValue) => setFieldValue("statuses", newValue)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        placeholder="Select statuses"
                                                        error={Boolean(touched.statuses && errors.statuses)}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: <>{params.InputProps.endAdornment}</>,
                                                        }}
                                                    />
                                                )}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="statuses" component="div" style={{ color: "red" }} />
                                </Stack>
                            </Grid> */}

                            <Grid item xs={12} md={6} lg={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="deliveryStatuses">Delivery Status</InputLabel>
                                    <Field name="deliveryStatuses">
                                        {({ field }) => (
                                            <Autocomplete
                                                //isOptionEqualToValue helps to define how comparison is gonna be made
                                                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                multiple
                                                options={deliveryStatusesOptions}
                                                getOptionLabel={(option) => option.label}
                                                value={Array.isArray(field.value) ? field.value : []}
                                                onChange={(event, newValue) => setFieldValue("deliveryStatuses", newValue)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        placeholder="Select delivery Status"
                                                        error={Boolean(touched.deliveryStatuses && errors.deliveryStatuses)}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: <>{params.InputProps.endAdornment}</>,
                                                        }}
                                                    />
                                                )}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="deliveryStatuses" component="div" style={{ color: "red" }} />
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="paymentStatuses">Payment Status</InputLabel>
                                    <Field name="paymentStatuses">
                                        {({ field }) => (
                                            <Autocomplete
                                                //isOptionEqualToValue helps to define how comparison is gonna be made
                                                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                multiple
                                                options={paymentStatusesOptions}
                                                getOptionLabel={(option) => option.label}
                                                value={Array.isArray(field.value) ? field.value : []}
                                                onChange={(event, newValue) => setFieldValue("paymentStatuses", newValue)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        placeholder="Select Payment Status"
                                                        error={Boolean(touched.paymentStatuses && errors.paymentStatuses)}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: <>{params.InputProps.endAdornment}</>,
                                                        }}
                                                    />
                                                )}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="paymentStatuses" component="div" style={{ color: "red" }} />
                                </Stack>
                            </Grid>
                            {/* Multi-select fields */}

                            <Grid item xs={12} md={12} lg={12}>
                                <center>
                                    {" "}
                                    <Button type="submit" label="Filter" className="p-button-primary m-2" />
                                    <Button type="button" onClick={() => handleReset(resetForm)} label="Reset" className="p-button-secondary m-2" />
                                </center>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <center>{errors.form && <div style={{ color: "red" }}>{errors.form}</div>}</center>
                            </Grid>
                        </Grid>
                        <Dialog
                            visible={showConfirmDialog}
                            header="Confirmation"
                            modal
                            onHide={handleCancel}
                            footer={
                                <>
                                    <Button label="Yes" onClick={handleConfirm} />
                                    <Button label="No" onClick={handleCancel} />
                                </>
                            }
                        >
                            Are you sure you want to submit the form?
                        </Dialog>

                        <Dialog
                            header="Confirm Reset"
                            visible={showResetConfirmDialog}
                            onHide={handleCancelReset}
                            modal
                            footer={
                                <>
                                    <Button label="Yes" onClick={() => handleConfirmReset(resetForm)} color="primary" autoFocus />
                                    <Button label="No" onClick={handleCancelReset} color="primary" />
                                </>
                            }
                        >
                            Are you sure you want to reset the form? All changes will be lost.
                        </Dialog>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default CardsFiltersFormWithStatustesDialog;
