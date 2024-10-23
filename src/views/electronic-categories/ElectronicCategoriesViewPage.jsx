import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import ListPage from "../electronic-brands/ListPage";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";
import useAuthContext from "../../context/AuthContext";

import { Image } from "primereact/image";

const ElectronicCategoriesViewPage = () => {
    const { getUserQuery } = useAuthContext();
    const location = useLocation();
    const { electronicCategoryData } = location.state;
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="product-category-view">
            <BreadcrumbNav />
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Category Details">
                    <div style={{ minHeight: "50vh", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                        {/* Display Image */}
                        <div className="card flex justify-content-center">
                            {/* <Image src={electronicCategoryData.cloudinary_photo_url} alt="Category Image" width="250" preview /> */}
                            <Image src={`${process.env.REACT_APP_IMAGE_BASE_URL}${electronicCategoryData?.photo_url}`} alt="Category Image" width="250" preview />
                        </div>
                        <div>
                            <p>
                                <strong>Name:</strong> {electronicCategoryData?.name}
                            </p>
                            <p>
                                <strong>Code:</strong> {electronicCategoryData?.code}
                            </p>
                            <p>
                                <strong>Status:</strong> {electronicCategoryData?.status}
                            </p>
                            <p>
                                <strong>Details:</strong> {electronicCategoryData?.details}
                            </p>
                            <p>
                                <strong>Created By:</strong> {electronicCategoryData?.created_by?.name}
                            </p>
                            <p>
                                <strong>Updated By:</strong> {electronicCategoryData?.updated_by?.name}
                            </p>
                            <p>
                                <strong>Created At:</strong> {moment(electronicCategoryData?.created_at)?.format("YYYY-MM-DD HH:mm:ss")}
                            </p>
                            <p>
                                <strong>Updated At:</strong> {moment(electronicCategoryData?.updated_at)?.format("YYYY-MM-DD HH:mm:ss")}
                            </p>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Electronic Category Brands">
                    <div>
                        <ListPage electronicCategoryData={electronicCategoryData} loggedInUserData={getUserQuery?.data?.data} />
                    </div>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default ElectronicCategoriesViewPage;
