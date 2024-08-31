import React, { useState, useContext, useMemo, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
import exportData from "highcharts/modules/export-data";
import fullscreen from "highcharts/modules/full-screen";
import noData from "highcharts/modules/no-data-to-display";
import drilldown from "highcharts/modules/drilldown";
import HC_accessibility from "highcharts/modules/accessibility";

//
import { getAllProductBarChartStatistics, getAllCustomerBarChartStatistics } from "../../../services/dashboard/barchat-stats-service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";
import { ProgressBar } from "primereact/progressbar";

import { Accordion, AccordionTab } from "primereact/accordion";

//lotties
import MaterialUiLoaderLottie from "../../../assets/lotties/pesa-lotties/material-ui-loading-lottie.json";
// import RobotProcessorLottie from "../../../assets/lotties/pesa-lotties/robot-processor-lottie.json";
import BrownFilesProcessingLottie from "../../../assets/lotties/pesa-lotties/brown-files-processing-lottie.json";
// import ComputerInFourCirclesLottie from "../../../assets/lotties/pesa-lotties/computer-in-four-circles-lottie.json";
// import ServerProcessingLottie from "../../../assets/lotties/pesa-lotties/server-processing-lottie.json";
// import DarkBluePeopleOnServerLottie from "../../../assets/lotties/pesa-lotties/dark-blue-people-on-server-lottie.json";
// import BoyGirlPlottingGraphLottie from "../../../assets/lotties/pesa-lotties/boy-girl-plotting-graph-lottie.json";
// import BoyBoyScanningFilesLottie from "../../../assets/lotties/pesa-lotties/boy-boy-scanning-files-lottie.json";
// import GirlGirlPlottingGraphsLottie from "../../../assets/lotties/pesa-lotties/girl-girl-plotting-graphs-lottie.json";
import SnailErrorLottie from "../../../assets/lotties/pesa-lotties/snail-error-lottie.json";
import Lottie from "lottie-react";

import BarChartsFiltersFormDialog from "./widgets/BarChartsFiltersFormDialog";
import { Button } from "primereact/button";
import moment from "moment";

import { Tooltip } from "@mui/material";

//
import useHandleQueryError from "../../../hooks/useHandleQueryError";

// Initialize the required Highcharts modules
exporting(Highcharts);
exportData(Highcharts);
fullscreen(Highcharts);
noData(Highcharts);
HC_accessibility(Highcharts);

const getChartOptions = (data, dataFilters) => {
    // if (!data || !Array.isArray(data) || data.length === 0) {
    //     return null;
    // }
    if (!data || !Array.isArray(data)) {
        return null;
    }
    function formatArray(arr, key) {
        if (!Array.isArray(arr) || arr.length === 0) return "";
        return arr.map((item) => item[key]).join(", ");
    }

    function formatFilters(dataFilters) {
        // Format the dates
        const startDate = dataFilters?.startDate ? moment(dataFilters.startDate).format("MMMM Do, YYYY") : null;
        const endDate = dataFilters?.endDate ? moment(dataFilters.endDate).format("MMMM Do, YYYY") : null;

        // Extracting and formatting the filters
        const statuses = formatArray(dataFilters?.statuses, "label");
        const orderBy = dataFilters?.orderBy?.label || null;
        const dataLimit = dataFilters?.dataLimit?.label || null;
        const productCategories = formatArray(dataFilters?.productCategories, "name");
        const productCategoryBrands = formatArray(dataFilters?.productCategoryBrands, "name");
        const products = formatArray(dataFilters?.products, "name");

        // Constructing the sentence
        let sentence = "Filters: ";
        if (statuses) sentence += `Statuses: ${statuses}. `;
        if (orderBy) sentence += `Order By: ${orderBy}. `;
        if (dataLimit) sentence += `Data Limit: ${dataLimit}. `;
        if (productCategories) sentence += `Product Categories: ${productCategories}. `;
        if (productCategoryBrands) sentence += `Product Category Brands: ${productCategoryBrands}. `;
        if (products) sentence += `Products: ${products}. `;
        if (startDate) sentence += `Start Date: ${startDate}. `;
        if (endDate) sentence += `End Date: ${endDate}.`;

        return sentence.trim();
    }

    let chartTitle = formatFilters(dataFilters);

    const options = {
        chart: {
            type: "bar", // Horizontal bar chart
            // height: 600,
        },
        title: { text: `Product Sales Performance <br/> ${chartTitle}` },
        xAxis: {
            categories: data.map((product) => product.name),
            title: {
                text: "Products",
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: "Sales",
                align: "high",
            },
            labels: {
                overflow: "justify",
            },
        },
        tooltip: {
            valuePrefix: "UGX",
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                },
            },
        },
        legend: {
            reversed: true,
        },
        credits: {
            enabled: false,
        },
        noData: {
            style: {
                fontWeight: "bold",
                fontSize: "16px",
                color: "#303030",
            },
            position: {
                align: "center",
                verticalAlign: "middle",
            },
            text: "No data to display",
        },
        series: [
            {
                name: "Sales",
                data: data.map((product) => product.sales),
            },
        ],
    };

    return options;
};

const ProductsBarChart = () => {
    //==================== chart filters ===================
    const [showFiltersFormDialog, setShowFiltersFormDialog] = useState(false);

    //chart filters initial data state
    const [filtersFormInitialDataValues, setFiltersFormInitialDataValues] = useState({
        startDate: moment().startOf("month").format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"), // Set to now
        // statuses: [
        //     { id: 1, label: "Pending", value: "PENDING" },
        //     { id: 2, label: "Processing", value: "PROCESSING" },
        //     { id: 3, label: "Transit", value: "TRANSIT" },
        //     { id: 4, label: "Delivered", value: "DELIVERED" },
        //     { id: 5, label: "Cancelled", value: "CANCELLED" },
        // ],
        deliveryStatuses: [{ label: "Delivered", value: "delivered" }],
        paymentStatuses: [{ label: "Paid", value: "Paid" }],
        orderBy: { id: 1, label: "Default", value: "default" },
        dataLimit: { id: 2, label: "5", value: 5 },
        // dataLimitNumber: null,
        productTypes: [],
        productCategories: [],
        productCategoryBrands: [],
        products: [],
    });

    console.log("testing ProductsBarChart such that it doesnt go into infinite due to useEffect dependancy array : ", filtersFormInitialDataValues);

    const toggleFiltersFormDialog = () => {
        setShowFiltersFormDialog(!showFiltersFormDialog);
    };

    const handleSubmitForFilters = (data) => {
        console.log("🚀 ~ handleSubmitForFilters ~ data:", data);
        setFiltersFormInitialDataValues(data);
    };

    //==================== end chart filters ===================

    // Products
    const ProductBarChartStatisticsPerfomanceChartQuery = useQuery({
        disable: false,
        queryKey: ["ProductBarChartStatistics", ...Object.values(filtersFormInitialDataValues)],
        queryFn: () => getAllProductBarChartStatistics({ ...filtersFormInitialDataValues }),
    });

    // Use the custom hook to handle errors with useMemo on the error object
    useHandleQueryError(ProductBarChartStatisticsPerfomanceChartQuery?.isError, ProductBarChartStatisticsPerfomanceChartQuery?.error);

    console.log("data for NiceTwo ProductBarChartStatisticsPerfomanceChartQuery ?.data?.data is:", ProductBarChartStatisticsPerfomanceChartQuery?.data?.data);

    const seriesData = ProductBarChartStatisticsPerfomanceChartQuery?.data?.data?.data;

    //=============== handle displaying filters on Chart end ======================

    return (
        <>
            {ProductBarChartStatisticsPerfomanceChartQuery?.isLoading ? (
                <>
                    <div className="col-12">
                        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ maxWidth: "400px" }}>
                                <Lottie animationData={BrownFilesProcessingLottie} style={{ height: "300px" }} loop={true} autoplay={true} />
                                <Lottie animationData={MaterialUiLoaderLottie} style={{ height: "50px" }} loop={true} autoplay={true} />
                            </div>
                        </div>
                        {/* <ProgressBar mode="indeterminate" style={{ height: "6px" }} /> */}
                    </div>
                </>
            ) : ProductBarChartStatisticsPerfomanceChartQuery?.isError ? (
                <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ maxWidth: "400px" }}>
                        <Lottie animationData={SnailErrorLottie} loop={true} autoplay={true} />
                    </div>
                </div>
            ) : (
                <>
                    <div className="col-12 text-right">
                        <Tooltip title="Filter">
                            <Button icon="pi pi-filter" onClick={toggleFiltersFormDialog} />
                        </Tooltip>

                        <BarChartsFiltersFormDialog
                            onSubmit={handleSubmitForFilters}
                            filtersFormInitialDataValues={filtersFormInitialDataValues}
                            setFiltersFormInitialDataValues={setFiltersFormInitialDataValues}
                            showFiltersFormDialog={showFiltersFormDialog}
                            setShowFiltersFormDialog={setShowFiltersFormDialog}
                        />
                    </div>
                    <div style={{ height: "400px" }}>
                        <HighchartsReact highcharts={Highcharts} options={getChartOptions(seriesData, ProductBarChartStatisticsPerfomanceChartQuery?.data?.data?.requestParams)} immutable={true} />
                    </div>
                </>
            )}
        </>
    );
};

export default ProductsBarChart;
