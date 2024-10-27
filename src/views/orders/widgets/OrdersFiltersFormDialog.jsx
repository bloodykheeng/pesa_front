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

//
import { getAllProductCategories } from "../../../services/products/product-categories-service";
import { getAllProductCategoryBrands } from "../../../services/products/product-category-brands-service";
import { getAllProducts } from "../../../services/products/products-service";
import { getAllProductTypes } from "../../../services/products/product-types-service";

//
import { getAllElectronicCategories } from "../../../services/electronics/electronic-categories-service";
import { getAllElectronicBrands } from "../../../services/electronics/electronic-brands-service";
import { getAllElectronicTypes } from "../../../services/electronics/electronic-types-service.js";

import { getAllInventoryTypes } from "../../../services/products/inventory_types-service";

//
import useHandleQueryError from "../../../hooks/useHandleQueryError";

const OrdersFiltersFormDialog = ({ onSubmit, filtersFormInitialDataValues, setFiltersFormInitialDataValues, showFiltersFormDialog, setShowFiltersFormDialog }) => {
    console.log("🚀 ~ OrdersFiltersFormDialog ~ filtersFormInitialDataValues:", filtersFormInitialDataValues);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showResetConfirmDialog, setShowResetConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    //product
    const [selectedProductTypes, setselectedProductTypes] = useState(filtersFormInitialDataValues?.productTypes ?? []);
    const [selectedProductCategories, setSelectedProductCategories] = useState(filtersFormInitialDataValues?.productCategories ?? []);
    console.log("🚀 ~ OrdersFiltersFormDialog ~ selectedProductCategories:", selectedProductCategories);
    const [selectedProductCategoryBrands, setSelectedProductCategoryBrands] = useState(filtersFormInitialDataValues?.productCategoryBrands ?? []);
    const memoizedFiltersFormInitialDataValues = useMemo(() => filtersFormInitialDataValues, [filtersFormInitialDataValues]);

    // State management
    const [selectedElectronicCategories, setSelectedElectronicCategories] = useState(filtersFormInitialDataValues?.electronicCategories ?? []);
    console.log("🚀 ~ OrdersFiltersFormDialog ~ selectedElectronicCategories:", selectedElectronicCategories);
    const [selectedElectronicBrands, setSelectedElectronicBrands] = useState(filtersFormInitialDataValues?.electronicBrands ?? []);
    const [selectedElectronicTypes, setSelectedElectronicTypes] = useState(filtersFormInitialDataValues?.electronicCategories ?? []);

    const [selectedInventoryTypes, setSelectedInventoryTypes] = useState(filtersFormInitialDataValues?.inventoryTypes ?? []);

    const hasProductType = filtersFormInitialDataValues?.inventoryTypes.some((type) => type.code === "01");
    const hasElectronicType = filtersFormInitialDataValues?.inventoryTypes.some((type) => type.code === "02");

    const [showProductFields, setShowProductFields] = useState(hasProductType);
    const [showElectronicFields, setShowElectronicFields] = useState(hasElectronicType);

    useEffect(() => {
        setselectedProductTypes(filtersFormInitialDataValues?.productTypes);
        setSelectedProductCategories(filtersFormInitialDataValues?.productCategories);
        setSelectedProductCategoryBrands(filtersFormInitialDataValues?.productCategoryBrands);

        // Set selected values for inventoryTypes, electronicCategories, and electronicBrands
        setSelectedInventoryTypes(filtersFormInitialDataValues?.inventoryTypes);
        setSelectedElectronicCategories(filtersFormInitialDataValues?.electronicCategories);
        setSelectedElectronicBrands(filtersFormInitialDataValues?.electronicBrands);
        setSelectedElectronicTypes(filtersFormInitialDataValues?.electronicTypes);
    }, [memoizedFiltersFormInitialDataValues]);

    // Queries and useEffects

    // product types
    const productTypesQuery = useQuery({
        queryKey: ["product-types"],
        queryFn: () => getAllProductTypes({}),
    });

    useHandleQueryError(productTypesQuery?.isError, productTypesQuery?.error);

    // Product Categories Query
    const productCategoriesQuery = useQuery({
        queryKey: ["product-categories"],
        queryFn: () => getAllProductCategories({}),
    });

    useHandleQueryError(productCategoriesQuery?.isError, productCategoriesQuery?.error);

    // Product Subcategories Query (depends on selected product category)
    const productCategoryBrandsQuery = useQuery({
        queryKey: ["category_brands", selectedProductCategories],
        queryFn: () => getAllProductCategoryBrands({ productCategories: selectedProductCategories }),
        enabled: selectedProductCategories.length > 0,
    });

    useHandleQueryError(productCategoryBrandsQuery?.isError, productCategoryBrandsQuery?.error);

    // Products Query (depends on selected product subcategory)
    const productsQuery = useQuery({
        queryKey: ["products", "by_category_brands", selectedProductCategoryBrands, "by_product_types", selectedProductTypes, "by_electronic_types", selectedElectronicTypes],
        queryFn: () => getAllProducts({ categoryBrands: selectedProductCategoryBrands, productTypes: selectedProductTypes, electronicTypes: selectedElectronicTypes }),
        enabled: (Array.isArray(selectedProductCategoryBrands) && selectedProductCategoryBrands.length > 0) || (Array.isArray(selectedElectronicTypes) && selectedElectronicTypes.length > 0),
    });

    useHandleQueryError(productsQuery?.isError, productsQuery?.error);

    //========== electronics ====================

    // Query to get electronic categories
    const electronicCategoriesQuery = useQuery({
        queryKey: ["electronic-categories"],
        queryFn: () => getAllElectronicCategories({}),
    });

    useHandleQueryError(electronicCategoriesQuery?.isError, electronicCategoriesQuery?.error);

    // Query to get electronic brands, enabled only if there is at least one selected category
    const electronicBrandsQuery = useQuery({
        queryKey: ["electronic-brands", selectedElectronicCategories],
        queryFn: () => getAllElectronicBrands({ electronic_categories: selectedElectronicCategories }), // Use the first selected category
        enabled: Array.isArray(selectedElectronicCategories) && selectedElectronicCategories.length > 0,
    });

    useHandleQueryError(electronicBrandsQuery?.isError, electronicBrandsQuery?.error);

    // Query to get electronic types, enabled only if there is at least one selected category and brand
    const electronicTypesQuery = useQuery({
        queryKey: ["electronic-types", selectedElectronicBrands],
        queryFn: () =>
            getAllElectronicTypes({
                electronic_brands: selectedElectronicBrands, // Use the first selected brand
            }),
        enabled: Array.isArray(selectedElectronicBrands) && selectedElectronicBrands.length > 0,
    });

    useHandleQueryError(electronicTypesQuery?.isError, electronicTypesQuery?.error);

    const inventoryTypesQuery = useQuery({
        queryKey: ["inventory-types"],
        queryFn: () => getAllInventoryTypes({}),
    });

    useHandleQueryError(inventoryTypesQuery?.isError, inventoryTypesQuery?.error);

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

    //
    const orderByOptions = [
        { id: 1, label: "Default", value: "default" },
        { id: 2, label: "Ascending", value: "asc" },
        { id: 3, label: "Descending", value: "desc" },
    ];

    const dataLimitOptions = [
        { id: 1, label: "All", value: "all" },
        { id: 2, label: "5", value: 5 },
        { id: 3, label: "10", value: 10 },
        { id: 4, label: "20", value: 20 },
        { id: 5, label: "25", value: 25 },
        { id: 6, label: "30", value: 30 },
    ];

    //-=========== handle reset ===============
    const handleReset = (resetForm) => {
        // setShowResetConfirmDialog(true);

        setSelectedProductCategories([]);
        setSelectedProductCategoryBrands([]);
        resetForm();
        setFiltersFormInitialDataValues({
            startDate: moment().startOf("month").format("YYYY-MM-DD"),
            endDate: moment().format("YYYY-MM-DD"), // Set to now
            // statuses: [
            //     { id: 1, label: "Pending", value: "PENDING" },
            //     { id: 2, label: "Processing", value: "PROCESSING" },
            //     { id: 3, label: "Transit", value: "TRANSIT" },
            //     { id: 4, label: "Delivered", value: "DELIVERED" },
            //     { id: 5, label: "Cancelled", value: "CANCELLED" },
            // ],
            deliveryStatuses: [],
            paymentStatuses: [],
            // orderBy: { id: 3, label: "Descending", value: "desc" },
            // dataLimit: { id: 2, label: "5", value: 5 },
            // dataLimitNumber: null,
            productTypes: [],
            productCategories: [],
            productCategoryBrands: [],
            products: [],
            inventoryTypes: [], // Add inventoryTypes here
            electronicCategories: [], // Add electronicCategories here
            electronicBrands: [], // Add electronicBrands here
            electronicTypes: [], // Add electronicTypes here
        });
        setShowProductFields(false);
        setShowElectronicFields(false);
        // setShowResetConfirmDialog(false);
    };

    const handleConfirmReset = (resetForm) => {
        setSelectedProductCategories([]);
        setSelectedProductCategoryBrands([]);
        resetForm();
        setFiltersFormInitialDataValues({
            startDate: moment().startOf("month").format("YYYY-MM-DD"),
            endDate: moment().format("YYYY-MM-DD"), // Set to now
            // statuses: [
            //     { id: 1, label: "Pending", value: "PENDING" },
            //     { id: 2, label: "Processing", value: "PROCESSING" },
            //     { id: 3, label: "Transit", value: "TRANSIT" },
            //     { id: 4, label: "Delivered", value: "DELIVERED" },
            //     { id: 5, label: "Cancelled", value: "CANCELLED" },
            // ],
            deliveryStatuses: [],
            paymentStatuses: [],
            // orderBy: { id: 3, label: "Descending", value: "desc" },
            // dataLimit: { id: 2, label: "5", value: 5 },
            // dataLimitNumber: null,
            productTypes: [],
            productCategories: [],
            productCategoryBrands: [],
            products: [],
            inventoryTypes: [], // Add inventoryTypes here
            electronicCategories: [], // Add electronicCategories here
            electronicBrands: [], // Add electronicBrands here
            electronicTypes: [], // Add electronicTypes here
        });

        setShowProductFields(false);
        setShowElectronicFields(false);
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
        if (
            (!Array.isArray(values.deliveryStatuses) || values.deliveryStatuses.length === 0) &&
            (!Array.isArray(values.productCategories) || values.productCategories.length === 0) &&
            (!Array.isArray(values.productCategoryBrands) || values.productCategoryBrands.length === 0) &&
            (!Array.isArray(values.products) || values.products.length === 0) &&
            !values.startDate &&
            !values.endDate
        ) {
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
                                <Grid item xs={12} md={6} lg={4}>
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

                                <Grid item xs={12} md={6} lg={4}>
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

                            <Grid item xs={12} md={6} lg={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="inventoryTypes">Inventory Types</InputLabel>
                                    <Field name="inventoryTypes">
                                        {({ field }) => (
                                            <Autocomplete
                                                multiple
                                                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                options={inventoryTypesQuery?.data?.data?.data || []}
                                                getOptionLabel={(option) => option.name}
                                                value={selectedInventoryTypes}
                                                onChange={(event, newValue) => {
                                                    setSelectedInventoryTypes(newValue);
                                                    setFieldValue("inventoryTypes", newValue);

                                                    // Determine visibility of related fields
                                                    const hasProductType = newValue.some((type) => type.code === "01");
                                                    const hasElectronicType = newValue.some((type) => type.code === "02");

                                                    setShowProductFields(hasProductType);
                                                    setShowElectronicFields(hasElectronicType);

                                                    // Clear non-dependent fields from local state
                                                    if (!hasProductType) {
                                                        setSelectedProductCategories([]);
                                                        setSelectedProductCategoryBrands([]);
                                                    }
                                                    if (!hasElectronicType) {
                                                        setSelectedElectronicCategories([]);
                                                        setSelectedElectronicBrands([]);
                                                        setSelectedElectronicTypes([]);
                                                    }

                                                    // Clear non-dependent fields from Formik state
                                                    if (!hasProductType) {
                                                        setFieldValue("productCategories", []);
                                                        setFieldValue("productCategoryBrands", []);
                                                        setFieldValue("productTypes", []);
                                                    }
                                                    if (!hasElectronicType) {
                                                        setFieldValue("electronicCategories", []);
                                                        setFieldValue("electronicBrands", []);
                                                        setFieldValue("electronicTypes", []);
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        placeholder="Select inventory types"
                                                        error={Boolean(touched.inventoryTypes && errors.inventoryTypes)}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <>
                                                                    {inventoryTypesQuery?.isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                    {params.InputProps.endAdornment}
                                                                </>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="inventoryTypes" component="div" />
                                </Stack>
                            </Grid>

                            {showProductFields && (
                                <>
                                    {/* Product-related fields */}
                                    <Grid item xs={12} md={6} lg={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="productCategories">Product Categories</InputLabel>
                                            <Field name="productCategories">
                                                {({ field }) => (
                                                    <Autocomplete
                                                        //isOptionEqualToValue helps to define how comparison is gonna be made
                                                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                        multiple
                                                        options={productCategoriesQuery?.data?.data?.data || []}
                                                        getOptionLabel={(option) => option.name}
                                                        value={selectedProductCategories}
                                                        onChange={(event, newValue) => {
                                                            setSelectedProductCategories(newValue);
                                                            setSelectedProductCategoryBrands([]);
                                                            setFieldValue("productCategories", newValue);
                                                            setFieldValue("productCategoryBrands", []);
                                                            setFieldValue("products", []);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                variant="outlined"
                                                                placeholder="Select product categories"
                                                                error={Boolean(touched.productCategories && errors.productCategories)}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    endAdornment: (
                                                                        <>
                                                                            {productCategoriesQuery?.isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                            {params.InputProps.endAdornment}
                                                                        </>
                                                                    ),
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            </Field>
                                            <ErrorMessage name="productCategories" component="div" />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="productCategoryBrands">Product Category Brands</InputLabel>
                                            <Field name="productCategoryBrands">
                                                {({ field }) => (
                                                    <Autocomplete
                                                        //isOptionEqualToValue helps to define how comparison is gonna be made
                                                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                        multiple
                                                        options={productCategoryBrandsQuery?.data?.data?.data || []}
                                                        getOptionLabel={(option) => option.name}
                                                        value={selectedProductCategoryBrands}
                                                        onChange={(event, newValue) => {
                                                            setSelectedProductCategoryBrands(newValue);
                                                            setFieldValue("productCategoryBrands", newValue);
                                                            setFieldValue("products", []);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                variant="outlined"
                                                                placeholder="Select product category brands"
                                                                error={Boolean(touched.productCategoryBrand && errors.productCategoryBrand)}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    endAdornment: (
                                                                        <>
                                                                            {productCategoryBrandsQuery?.isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                            {params.InputProps.endAdornment}
                                                                        </>
                                                                    ),
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            </Field>
                                            <ErrorMessage name="productCategoryBrands" component="div" style={{ color: "red" }} />
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="productTypes">Product Types</InputLabel>
                                            <Field name="productTypes">
                                                {({ field }) => (
                                                    <Autocomplete
                                                        //isOptionEqualToValue helps to define how comparison is gonna be made
                                                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                        multiple
                                                        options={productTypesQuery?.data?.data?.data || []}
                                                        getOptionLabel={(option) => option.name}
                                                        value={selectedProductTypes}
                                                        onChange={(event, newValue) => {
                                                            setselectedProductTypes(newValue);
                                                            setFieldValue("productTypes", newValue);

                                                            //
                                                            setFieldValue("products", []);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                variant="outlined"
                                                                placeholder="Select product types"
                                                                error={Boolean(touched.productTypes && errors.productTypes)}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    endAdornment: (
                                                                        <>
                                                                            {productTypesQuery?.isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                            {params.InputProps.endAdornment}
                                                                        </>
                                                                    ),
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            </Field>
                                            <ErrorMessage name="productTypes" component="div" />
                                        </Stack>
                                    </Grid>
                                </>
                            )}

                            {showElectronicFields && (
                                <>
                                    {/* Electronic-related fields */}
                                    <Grid item xs={12} md={6} lg={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="electronicCategories">Electronic Categories</InputLabel>
                                            <Field name="electronicCategories">
                                                {({ field }) => (
                                                    <Autocomplete
                                                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                        multiple
                                                        options={electronicCategoriesQuery?.data?.data?.data || []}
                                                        getOptionLabel={(option) => option.name}
                                                        value={selectedElectronicCategories}
                                                        onChange={(event, newValue) => {
                                                            setSelectedElectronicCategories(newValue);
                                                            setSelectedElectronicBrands([]);
                                                            setSelectedElectronicTypes([]);
                                                            setFieldValue("electronicCategories", newValue);
                                                            setFieldValue("electronicBrands", []);
                                                            setFieldValue("electronicTypes", []);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                variant="outlined"
                                                                placeholder="Select electronic categories"
                                                                error={Boolean(touched.electronicCategories && errors.electronicCategories)}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    endAdornment: (
                                                                        <>
                                                                            {electronicCategoriesQuery?.isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                            {params.InputProps.endAdornment}
                                                                        </>
                                                                    ),
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            </Field>
                                            <ErrorMessage name="electronicCategories" component="div" />
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="electronicBrands">Electronic Brands</InputLabel>
                                            <Field name="electronicBrands">
                                                {({ field }) => (
                                                    <Autocomplete
                                                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                        multiple
                                                        options={electronicBrandsQuery?.data?.data?.data || []}
                                                        getOptionLabel={(option) => option.name}
                                                        value={selectedElectronicBrands}
                                                        onChange={(event, newValue) => {
                                                            setSelectedElectronicBrands(newValue);
                                                            setSelectedElectronicTypes([]);
                                                            setFieldValue("electronicBrands", newValue);
                                                            setFieldValue("electronicTypes", []);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                variant="outlined"
                                                                placeholder="Select electronic brands"
                                                                error={Boolean(touched.electronicBrands && errors.electronicBrands)}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    endAdornment: (
                                                                        <>
                                                                            {electronicBrandsQuery?.isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                            {params.InputProps.endAdornment}
                                                                        </>
                                                                    ),
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            </Field>
                                            <ErrorMessage name="electronicBrands" component="div" />
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="electronicTypes">Electronic Types</InputLabel>
                                            <Field name="electronicTypes">
                                                {({ field }) => (
                                                    <Autocomplete
                                                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                        multiple
                                                        options={electronicTypesQuery?.data?.data?.data || []}
                                                        getOptionLabel={(option) => option.name}
                                                        value={selectedElectronicTypes}
                                                        onChange={(event, newValue) => {
                                                            setSelectedElectronicTypes(newValue);
                                                            setFieldValue("electronicTypes", newValue);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                variant="outlined"
                                                                placeholder="Select electronic types"
                                                                error={Boolean(touched.electronicTypes && errors.electronicTypes)}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    endAdornment: (
                                                                        <>
                                                                            {electronicTypesQuery?.isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                            {params.InputProps.endAdornment}
                                                                        </>
                                                                    ),
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            </Field>
                                            <ErrorMessage name="electronicTypes" component="div" />
                                        </Stack>
                                    </Grid>
                                </>
                            )}

                            <Grid item xs={12} md={6} lg={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="products">Products</InputLabel>
                                    <Field name="products">
                                        {({ field }) => (
                                            <Autocomplete
                                                //isOptionEqualToValue helps to define how comparison is gonna be made
                                                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                multiple
                                                options={productsQuery?.data?.data?.data || []}
                                                // getOptionLabel={(option) => option.name}
                                                getOptionLabel={(option) => `${option.name}`}
                                                value={field.value}
                                                onChange={(event, newValue) => setFieldValue("products", newValue)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        placeholder="Select products"
                                                        error={Boolean(touched.products && errors.products)}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <>
                                                                    {productsQuery?.isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                    {params.InputProps.endAdornment}
                                                                </>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="products" component="div" style={{ color: "red" }} />
                                </Stack>
                            </Grid>

                            {/* Multi-select fields */}

                            {/* orderBy Single Select */}
                            {/* <Grid item xs={12} md={6} lg={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="orderBy">Order By</InputLabel>
                                    <Field name="orderBy">
                                        {({ field }) => (
                                            <Autocomplete
                                                options={orderByOptions}
                                                //isOptionEqualToValue helps to define how comparison is gonna be made
                                                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                getOptionLabel={(option) => option.label}
                                                value={field.value}
                                                onChange={(event, newValue) => setFieldValue("orderBy", newValue)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        placeholder="Select order by"
                                                        error={Boolean(touched.order && errors.order)}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: <>{params.InputProps.endAdornment}</>,
                                                        }}
                                                    />
                                                )}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="orderBy" component="div" style={{ color: "red" }} />
                                </Stack>
                            </Grid> */}

                            {/* <Grid item xs={12} md={6} lg={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="dataLimitNumber">Data Limit Number</InputLabel>
                                    <Field name="dataLimitNumber">
                                        {({ field }) => <TextField {...field} id="dataLimitNumber" variant="outlined" placeholder="Enter data limit" type="number" InputProps={{ inputProps: { min: 1 } }} error={Boolean(touched.dataLimitNumber && errors.dataLimitNumber)} />}
                                    </Field>
                                    <ErrorMessage name="dataLimitNumber" component="div" style={{ color: "red" }} />
                                </Stack>
                            </Grid> */}

                            {/* <Grid item xs={12} md={6} lg={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="dataLimit">Data Limit</InputLabel>
                                    <Field name="dataLimit">
                                        {({ field }) => (
                                            <Autocomplete
                                                options={dataLimitOptions}
                                                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                getOptionLabel={(option) => option.label}
                                                value={field.value}
                                                onChange={(event, newValue) => setFieldValue("dataLimit", newValue)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        placeholder="Select data limit"
                                                        error={Boolean(touched.dataLimit && errors.dataLimit)}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: <>{params.InputProps.endAdornment}</>,
                                                        }}
                                                    />
                                                )}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="dataLimit" component="div" style={{ color: "red" }} />
                                </Stack>
                            </Grid> */}

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

                            <Grid item xs={12} md={6} lg={4}>
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

                            <Grid item xs={12} md={6} lg={4}>
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

export default OrdersFiltersFormDialog;
