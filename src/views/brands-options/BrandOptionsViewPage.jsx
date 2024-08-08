import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import ListPage from "../brands-options-products/ListPage";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";

import useAuthContext from "../../context/AuthContext";

const ProductCategoryBrandsViewPage = () => {
    const { getUserQuery } = useAuthContext();
    const location = useLocation();
    const { BrandOptionData } = location.state;
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="product-category-view">
            <BreadcrumbNav />
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Option Details">
                    <Card title="Option Details">
                        <div style={{ minHeight: "50vh" }}>
                            <p>
                                <strong>Name:</strong> {BrandOptionData.name}
                            </p>
                            <p>
                                <strong>Created At:</strong> {moment(BrandOptionData.created_at).format("YYYY-MM-DD HH:mm:ss")}
                            </p>
                            {/* Add more details as needed */}
                        </div>
                    </Card>
                </TabPanel>
                <TabPanel header="Products">
                    <div>
                        <ListPage productCategoryId={BrandOptionData?.product_category_id} productSubCategoryId={BrandOptionData?.id} loggedInUserData={getUserQuery?.data?.data} />
                    </div>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default ProductCategoryBrandsViewPage;
