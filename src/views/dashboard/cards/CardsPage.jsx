import React, { useState, useContext, useEffect, useRef } from "react";

import { Grid, Stack } from "@mui/material";

//
import OrdersCard from "./OrdersCard";

const CardsPage = ({ measure = "sales_value" }) => {
    return (
        // <div style={{ padding: "10px" }}>
        <Grid style={{ padding: "10px" }} container spacing={2} justifyContent="center" alignItems="center">
            <OrdersCard measure={measure} />

            {/* <RevenueWeekToDate measure={measure} />

            <RevenueMonthToDate measure={measure} />

            <RevenueYearToDate measure={measure} /> */}
        </Grid>
        // </div>
    );
};

export default CardsPage;
