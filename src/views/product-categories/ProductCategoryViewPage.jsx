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

import { Image } from "primereact/image";

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
                    <div style={{ minHeight: "50vh", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                        {/* Display Image */}
                        <div className="card flex justify-content-center">
                            {/* <Image src={productCategoryData.cloudinary_photo_url} alt="Category Image" width="250" preview /> */}
                            <Image src={`${process.env.REACT_APP_IMAGE_BASE_URL}${productCategoryData?.photo_url}`} alt="Category Image" width="250" preview />
                        </div>
                        <div>
                            <p>
                                <strong>Name:</strong> {productCategoryData?.name}
                            </p>
                            <p>
                                <strong>Code:</strong> {productCategoryData?.code}
                            </p>
                            <p>
                                <strong>Status:</strong> {productCategoryData?.status}
                            </p>
                            <p>
                                <strong>Details:</strong> {productCategoryData?.details}
                            </p>
                            <p>
                                <strong>Created By:</strong> {productCategoryData?.created_by?.name}
                            </p>
                            <p>
                                <strong>Updated By:</strong> {productCategoryData?.updated_by?.name}
                            </p>
                            <p>
                                <strong>Created At:</strong> {moment(productCategoryData?.created_at)?.format("YYYY-MM-DD HH:mm:ss")}
                            </p>
                            <p>
                                <strong>Updated At:</strong> {moment(productCategoryData?.updated_at)?.format("YYYY-MM-DD HH:mm:ss")}
                            </p>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Product Category Brands">
                    <div>
                        <ListPage productCategoryData={productCategoryData} loggedInUserData={getUserQuery?.data?.data} />
                    </div>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default ProductCategoryViewPage;
