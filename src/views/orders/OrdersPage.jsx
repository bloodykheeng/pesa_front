import React from "react";

// material-ui
import Typography from "@mui/material/Typography";
import OrdersExport from "./OrdersExport";

// project import

import ListPage from "./ListPage";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";

function OrdersPage() {
    return (
        <div>
            <BreadcrumbNav />
            <div>
                <OrdersExport />
            </div>
            <div className="card">
                <ListPage />
            </div>
        </div>
    );
}

export default OrdersPage;
