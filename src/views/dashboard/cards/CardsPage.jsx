import React, { useState, useContext, useEffect, useRef } from "react";

import { Grid, Stack } from "@mui/material";
import { Panel } from "primereact/panel";

//
import OrdersCard from "./OrdersCard";
import CustomersStatsCard from "./CustomersStatsCard";
import PackageStatsCard from "./PackageStatsCard";
import TransactionStatsCard from "./TransactionStatsCard";

const CardsPage = ({ measure = "sales_value" }) => {
    return (
        // <div style={{ padding: "10px" }}>
        <Panel header={`Statistics`} toggleable style={{ minWidth: "100%" }}>
            <Grid style={{ padding: "10px" }} container spacing={2} justifyContent="center" alignItems="center">
                <OrdersCard />
                <PackageStatsCard />
                <CustomersStatsCard />
                <TransactionStatsCard />
            </Grid>
        </Panel>
        // </div>
    );
};

export default CardsPage;
