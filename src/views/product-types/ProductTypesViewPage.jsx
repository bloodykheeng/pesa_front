import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import ListPage from "../product-category-brands/ListPage";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";
import useAuthContext from "../../context/AuthContext";

const ProductTypesViewPage = () => {
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
                        <div style={{ minHeight: "50vh" }}>
                            <p>
                                <strong>Name:</strong> {productCategoryData.name}
                            </p>
                            <p>
                                <strong>Created At:</strong> {moment(productCategoryData.created_at).format("YYYY-MM-DD HH:mm:ss")}
                            </p>
                        </div>

                        {/* Add more details as needed */}
                    </Card>
                </TabPanel>
                <TabPanel header="Product Category Brands">
                    <div>
                        <ListPage productCategoryId={productCategoryData?.id} loggedInUserData={getUserQuery?.data?.data} />
                    </div>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default ProductTypesViewPage;
