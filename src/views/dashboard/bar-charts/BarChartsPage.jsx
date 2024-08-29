import React from "react";
import ProductsBarChart from "./ProductsBarChart";
import CustomersBarChart from "./CustomersBarChart";
import { Panel } from "primereact/panel";

function BarChartsPage() {
    return (
        <div className="col-12">
            <Panel header={`Sales Perfomance`} toggleable style={{ minWidth: "100%" }}>
                <div className="col-12" style={{ display: "flex", flexWrap: "wrap" }}>
                    <div className="col-12 xl:col-6">
                        <ProductsBarChart />
                    </div>
                    <div className="col-12 xl:col-6">
                        <CustomersBarChart />
                    </div>
                </div>
            </Panel>
        </div>
    );
}

export default BarChartsPage;
