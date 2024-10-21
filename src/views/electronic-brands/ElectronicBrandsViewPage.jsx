import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import ListPage from "../electronic-types/ListPage";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";

import useAuthContext from "../../context/AuthContext";

import { Image } from "primereact/image";

const ElectronicBrandsViewPage = () => {
    const { getUserQuery } = useAuthContext();
    const location = useLocation();
    console.log("🚀 ~ ElectronicBrandsViewPage ~ location:", location?.state);
    const { electronicCategoryBrandData } = location.state;
    console.log("🚀 ~ ElectronicBrandsViewPage ~ electronicCategoryBrandData:", electronicCategoryBrandData);
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="product-category-view">
            <BreadcrumbNav />
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Brand Details">
                    <div style={{ minHeight: "50vh", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                        {/* Display Image */}
                        <div className="card flex justify-content-center">
                            {/* <Image src={electronicCategoryBrandData?.cloudinary_photo_url || electronicCategoryBrandData?.photo_url} alt="Brand Image" width="250" preview /> */}
                            <Image src={`${process.env.REACT_APP_IMAGE_BASE_URL}${electronicCategoryBrandData?.photo_url}`} alt="Category Image" width="250" preview />
                        </div>
                        <div>
                            <p>
                                <strong>Name:</strong> {electronicCategoryBrandData?.name}
                            </p>
                            <p>
                                <strong>Code:</strong> {electronicCategoryBrandData?.code}
                            </p>
                            <p>
                                <strong>Status:</strong> {electronicCategoryBrandData?.status}
                            </p>
                            <p>
                                <strong>Details:</strong> {electronicCategoryBrandData?.details}
                            </p>
                            <p>
                                <strong>Electronic Category :</strong> {electronicCategoryBrandData?.electronic_category?.name}
                            </p>
                            <p>
                                <strong>Created By:</strong> {electronicCategoryBrandData?.created_by?.name}
                            </p>
                            <p>
                                <strong>Updated By:</strong> {electronicCategoryBrandData?.updated_by?.name}
                            </p>
                            <p>
                                <strong>Created At:</strong> {moment(electronicCategoryBrandData?.created_at).format("YYYY-MM-DD HH:mm:ss")}
                            </p>
                            <p>
                                <strong>Updated At:</strong> {moment(electronicCategoryBrandData?.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                            </p>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Brand Electronic Types">
                    <div>
                        <ListPage electronicBrandsData={electronicCategoryBrandData} loggedInUserData={getUserQuery?.data?.data} />
                    </div>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default ElectronicBrandsViewPage;
