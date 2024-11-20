import React, { useState } from "react";

// material-ui
import Typography from "@mui/material/Typography";

// project import

import ListPage from "./ListPage";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";

import moment from "moment";

function OrdersPage() {
    return (
        <div>
            <BreadcrumbNav />

            <div className="card">
                <ListPage />
            </div>
        </div>
    );
}

export default OrdersPage;
