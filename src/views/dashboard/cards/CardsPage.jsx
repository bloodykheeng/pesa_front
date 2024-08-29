import React, { useState, useContext, useEffect, useRef } from "react";

import { Grid, Stack } from "@mui/material";

//
import OrdersCard from "./OrdersCard";
import CustomersStatsCard from "./CustomersStatsCard";
import PackageStatsCard from "./PackageStatsCard";
import TransactionStatsCard from "./TransactionStatsCard";

const CardsPage = ({ measure = "sales_value" }) => {
    return (
        // <div style={{ padding: "10px" }}>
        <Grid style={{ padding: "10px" }} container spacing={2} justifyContent="center" alignItems="center">
            <OrdersCard />
            <PackageStatsCard />
            <CustomersStatsCard />
            <TransactionStatsCard />
        </Grid>
        // </div>
    );
};

export default CardsPage;
