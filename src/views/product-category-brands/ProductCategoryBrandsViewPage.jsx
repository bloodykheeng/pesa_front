import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import ListPage from "../brands-accessories/ListPage";
import BrandOptionsListPage from "../brands-options/ListPage";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";

import useAuthContext from "../../context/AuthContext";

const ProductCategoryBrandsViewPage = () => {
    const { getUserQuery } = useAuthContext();
    const location = useLocation();
    const { productCategoryBrandData } = location.state;
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="product-category-view">
            <BreadcrumbNav />
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Brand Details">
                    <Card title="Brand Details">
                        <div style={{ minHeight: "50vh" }}>
                            <p>
                                <strong>Name:</strong> {productCategoryBrandData?.name}
                            </p>
                            <p>
                                <strong>Created At:</strong> {moment(productCategoryBrandData?.created_at).format("YYYY-MM-DD HH:mm:ss")}
                            </p>
                            {/* Add more details as needed */}
                        </div>
                    </Card>
                </TabPanel>
                <TabPanel header="Brand Accesories">
                    <div>
                        <ListPage productCategoryBrandData={productCategoryBrandData} loggedInUserData={getUserQuery?.data?.data} />
                    </div>
                </TabPanel>
                <TabPanel header="Brand Options">
                    <div>
                        <BrandOptionsListPage productCategoryBrandData={productCategoryBrandData} loggedInUserData={getUserQuery?.data?.data} />
                    </div>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default ProductCategoryBrandsViewPage;
