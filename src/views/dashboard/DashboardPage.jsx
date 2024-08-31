import React from "react";
import CardsPage from "./cards/CardsPage";
import BarChartsPage from "./bar-charts/BarChartsPage";

function DashboardPage() {
    return (
        <div>
            <div className="col-12">
                <CardsPage />
            </div>
            <div className="col-12">
                <BarChartsPage />
            </div>
        </div>
    );
}

export default DashboardPage;
