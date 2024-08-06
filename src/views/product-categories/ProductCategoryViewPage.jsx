import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import ListPage from "../product-sub-categories/ListPage";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";
import useAuthContext from "../../context/AuthContext";

const ProductCategoryViewPage = () => {
    const { getUserQuery } = useAuthContext();
    const location = useLocation();
    const { productCategoryData } = location.state;
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="product-category-view">
            <BreadcrumbNav />
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Category Details">
                    <Card title="Category Details">
                        <p>
                            <strong>Name:</strong> {productCategoryData.name}
                        </p>
                        <p>
                            <strong>Created At:</strong> {moment(productCategoryData.created_at).format("YYYY-MM-DD HH:mm:ss")}
                        </p>
                        {/* Add more details as needed */}
                    </Card>
                </TabPanel>
                <TabPanel header="Product Sub Categories">
                    <Card title="Product Sub Categories">
                        <ListPage productCategoryId={productCategoryData?.id} loggedInUserData={getUserQuery?.data?.data} />
                    </Card>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default ProductCategoryViewPage;
