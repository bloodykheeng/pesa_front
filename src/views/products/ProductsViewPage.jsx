import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import ListPage from "./ListPage";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";

import useAuthContext from "../../context/AuthContext";

const ProductsViewPage = () => {
    const { getUserQuery } = useAuthContext();
    const location = useLocation();
    const { productSubCategoryData } = location.state;
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="product-category-view">
            <BreadcrumbNav />
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Sub Category Details">
                    <Card title="Sub Category Details">
                        <p>
                            <strong>Name:</strong> {productSubCategoryData.name}
                        </p>
                        <p>
                            <strong>Created At:</strong> {moment(productSubCategoryData.created_at).format("YYYY-MM-DD HH:mm:ss")}
                        </p>
                        {/* Add more details as needed */}
                    </Card>
                </TabPanel>
                <TabPanel header="Products">
                    <Card title="Products">
                        <ListPage productCategoryId={productSubCategoryData?.product_category_id} productSubCategoryId={productSubCategoryData?.id} loggedInUserData={getUserQuery?.data?.data} />
                    </Card>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default ProductsViewPage;
