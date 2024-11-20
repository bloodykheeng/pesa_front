import React, { useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import * as XLSX from "xlsx";
import OrdersFiltersFormDialog from "./widgets/OrdersFiltersFormDialog";
import { ProgressBar } from "primereact/progressbar";

import { postToGetOrderExcelExportData } from "../../services/orders/orders-service";

import RowForm from "./widgets/RowForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";
import moment from "moment";

//
import handleMutationError from "../../hooks/handleMutationError";

const OrdersExport = ({ filtersFormInitialDataValues, setFiltersFormInitialDataValues }) => {
    // Sample data array of JSON objects
    const sampleOrders = [
        { id: 1, orderNumber: "ORD001", customer: "Customer A", amount: 100, date: "2023-10-01" },
        { id: 2, orderNumber: "ORD002", customer: "Customer B", amount: 200, date: "2023-10-02" },
        { id: 3, orderNumber: "ORD003", customer: "Customer C", amount: 150, date: "2023-10-03" },
    ];

    //==================== chart filters ===================
    const [showFiltersFormDialog, setShowFiltersFormDialog] = useState(false);
    const [accordionActiveIndex, setAccordionActiveIndex] = useState(null);

    console.log("🚀 ~ OrdersExport ~ filtersFormInitialDataValues:", filtersFormInitialDataValues);

    console.log("testing ProductsBarChart such that it doesnt go into infinite due to useEffect dependancy array : ", filtersFormInitialDataValues);

    const toggleFiltersFormDialog = () => {
        setShowFiltersFormDialog(!showFiltersFormDialog);
    };

    const queryClient = useQueryClient();

    const [exportMutationIsLoading, setExportMutationIsLoading] = useState(false);
    const ordersexcelExportMutation = useMutation({
        mutationFn: postToGetOrderExcelExportData,
        onSuccess: (data) => {
            console.log("🚀 ~ OrdersExport ~ data:", data);
            // queryClient.invalidateQueries(["orders"]);

            if (!Array.isArray(data?.data?.data) || data?.data?.data.length === 0) {
                toast.success("No data available");
            } else {
                toast.success("Your Orders Excell Export data has been processed successfully");
                exportOrders(data?.data?.data);
            }
            // props.onClose();
            setExportMutationIsLoading(false);
        },
        onError: (error) => {
            // props.onClose();
            handleMutationError(error, setExportMutationIsLoading);
        },
    });

    const handleSubmitForFilters = (data) => {
        console.log("🚀 ~ handleSubmitForFilters ~ data:", data);
        setFiltersFormInitialDataValues(data);
    };

    //==================== end chart filters ===================

    const handleExport = () => {
        setExportMutationIsLoading(true);
        ordersexcelExportMutation.mutate(filtersFormInitialDataValues);
    };

    // Export data as XLSX
    // Export data as XLSX
    const exportOrders = (data) => {
        // Check if data is empty or not an array
        if (!Array.isArray(data) || data.length === 0) {
            data = [{ "No Data": "No data available" }]; // Placeholder row
        }

        // Access startDate and endDate from filtersFormInitialDataValues
        const startDate = filtersFormInitialDataValues?.startDate;
        const endDate = filtersFormInitialDataValues?.endDate;

        // Format file name with start and end dates
        const fileName = `OrdersData_${startDate}_to_${endDate}.xlsx`;

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <div>
            <Accordion activeIndex={accordionActiveIndex} onTabChange={(e) => setAccordionActiveIndex(e.index)}>
                <AccordionTab header="Export Orders Data">
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                        <Button label="Filter" icon="pi pi-filter" onClick={() => setShowFiltersFormDialog(true)} className="p-button-outlined p-m-3" />

                        {exportMutationIsLoading ? <ProgressBar mode="indeterminate" style={{ margin: "1rem", height: "6px", width: "100%" }} /> : <Button label="Export to XLSX" icon="pi pi-file-excel" onClick={handleExport} className="p-button-success" />}
                    </div>
                </AccordionTab>
            </Accordion>

            <OrdersFiltersFormDialog onSubmit={handleSubmitForFilters} filtersFormInitialDataValues={filtersFormInitialDataValues} setFiltersFormInitialDataValues={setFiltersFormInitialDataValues} showFiltersFormDialog={showFiltersFormDialog} setShowFiltersFormDialog={setShowFiltersFormDialog} />
        </div>
    );
};

export default OrdersExport;
