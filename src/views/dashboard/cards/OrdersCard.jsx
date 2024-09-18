import React, { useState, useContext, useEffect, useRef } from "react";
import numeral from "numeral";

//
import { getAllOrderStatistics, getAllPackageStatistics, getAllCustomerStatistics, getAllTransactionStatistics } from "../../../services/dashboard/card-stats-service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Grid, Stack } from "@mui/material";

//lotties
import MaterialUiLoaderLottie from "../../../assets/lotties/pesa-lotties/material-ui-loading-lottie.json";
import SnailErrorLottie from "../../../assets/lotties/pesa-lotties/snail-error-lottie.json";
import Lottie from "lottie-react";
import moment from "moment";

//
import CardsFiltersFormDialog from "./widgets/CardsFiltersFormDialog";
import { Button } from "primereact/button";
import { Tooltip } from "@mui/material";

//
import useHandleQueryError from "../../../hooks/useHandleQueryError";

const formatNumber = (number) => {
    return numeral(number).format("0.[00]a"); // e.g., 3.5k, 3.45m, 3.4b
};

const OrdersCard = () => {
    //==================== chart filters ===================
    const [showFiltersFormDialog, setShowFiltersFormDialog] = useState(false);

    //chart filters initial data state
    const [filtersFormInitialDataValues, setFiltersFormInitialDataValues] = useState({
        startDate: moment().startOf("month").format("YYYY-MM-DD"),
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

    const toggleFiltersFormDialog = () => {
        setShowFiltersFormDialog(!showFiltersFormDialog);
    };

    const handleSubmitForFilters = (data) => {
        console.log("🚀 ~cards  handleSubmitForFilters ~ data:", data);
        setFiltersFormInitialDataValues(data);
    };

    //==================== end chart filters ===================

    // Products
    const OrderStatisticsDataQuery = useQuery({
        disable: false,
        queryKey: ["order-statistics", ...Object.values(filtersFormInitialDataValues)],
        queryFn: () => getAllOrderStatistics({ ...filtersFormInitialDataValues }),
    });

    // Use the custom hook to handle errors with useMemo on the error object
    useHandleQueryError(OrderStatisticsDataQuery?.isError, OrderStatisticsDataQuery?.error);

    const OrderStatisticsData = OrderStatisticsDataQuery?.data?.data?.data;
    console.log("🚀 ~ OrdersCard ~ OrderStatisticsData:", OrderStatisticsData);

    //========================

    const SalesCard = ({ total_orders, total_sales }) => {
        const [visible, setVisible] = useState(false);

        return (
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Orders</span>
                        <Tooltip title="total number of orders" arrow>
                            <div className={`text-900 font-medium text-xl`}>{formatNumber(total_orders)}</div>
                        </Tooltip>
                    </div>
                    <div
                        className="flex align-items-center justify-content-center bg-blue-100 border-round"
                        style={{
                            width: "2.5rem",
                            height: "2.5rem",
                        }}
                        onClick={() => setVisible(true)}
                    >
                        {/* <i className="pi pi-chart-bar text-blue-500 text-xl" /> */}
                        <Tooltip title="Filter">
                            <Button icon="pi pi-filter" onClick={toggleFiltersFormDialog} />
                        </Tooltip>

                        <CardsFiltersFormDialog
                            onSubmit={handleSubmitForFilters}
                            filtersFormInitialDataValues={filtersFormInitialDataValues}
                            setFiltersFormInitialDataValues={setFiltersFormInitialDataValues}
                            showFiltersFormDialog={showFiltersFormDialog}
                            setShowFiltersFormDialog={setShowFiltersFormDialog}
                        />
                    </div>
                </div>
                <div className="mb-1">
                    <div className={`font-medium mb-1 flex justify-content-between`}>
                        <span style={{ fontSize: "10px" }}>Sales: UGX {formatNumber(total_sales)}</span>
                    </div>

                    {/* <div className={`font-medium flex justify-content-between`}>
                        <span style={{ fontSize: "10px" }}>Target: UGX {formatNumber(455)}</span>
                    </div> */}
                </div>
            </div>
        );
    };

    return (
        <>
            <Grid item xs={12} md={6} lg={3}>
                {OrderStatisticsDataQuery?.isLoading ? (
                    <div className="col-12">
                        {/* <ProgressBar mode="indeterminate" style={{ height: "6px" }} /> */}
                        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ maxWidth: "100%" }}>
                                {/* <Lottie animationData={RobotProcessorLottie} loop={true} style={{ height: "300px" }} autoplay={true} /> */}
                                <Lottie animationData={MaterialUiLoaderLottie} style={{ height: "50px" }} loop={true} autoplay={true} />
                            </div>
                        </div>
                    </div>
                ) : OrderStatisticsDataQuery?.isError ? (
                    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ maxWidth: "400px" }}>
                            <Lottie animationData={SnailErrorLottie} loop={true} autoplay={true} />
                        </div>
                    </div>
                ) : (
                    <>
                        <SalesCard {...OrderStatisticsData} />
                    </>
                )}
            </Grid>
        </>
    );
};

export default OrdersCard;
