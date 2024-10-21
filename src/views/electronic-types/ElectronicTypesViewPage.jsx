import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import ProductsListPage from "../products/ListPage";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";

import useAuthContext from "../../context/AuthContext";

import { Image } from "primereact/image";

const ElectronicTypesViewPage = () => {
    const { getUserQuery } = useAuthContext();
    const location = useLocation();
    const { electronicTypeData } = location.state;
    console.log("🚀 ~ ElectronicTypesViewPage ~ electronicTypeData:", electronicTypeData);
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="product-category-view">
            <BreadcrumbNav />
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Electronic Type Details">
                    <div style={{ minHeight: "50vh", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                        {/* Display Image */}
                        <div className="card flex justify-content-center">
                            {/* <Image src={electronicTypeData?.cloudinary_photo_url || electronicTypeData?.photo_url} alt="Brand Image" width="250" preview /> */}
                            <Image src={`${process.env.REACT_APP_IMAGE_BASE_URL}${electronicTypeData.photo_url}`} alt="Category Image" width="250" preview />
                        </div>
                        <div>
                            <p>
                                <strong>Name:</strong> {electronicTypeData?.name}
                            </p>
                            <p>
                                <strong>Code:</strong> {electronicTypeData?.code}
                            </p>
                            <p>
                                <strong>Status:</strong> {electronicTypeData?.status}
                            </p>
                            <p>
                                <strong>Details:</strong> {electronicTypeData?.details}
                            </p>
                            <p>
                                <strong>Product Category :</strong> {electronicTypeData?.product_category?.name}
                            </p>
                            <p>
                                <strong>Created By:</strong> {electronicTypeData?.created_by?.name}
                            </p>
                            <p>
                                <strong>Updated By:</strong> {electronicTypeData?.updated_by?.name}
                            </p>
                            <p>
                                <strong>Created At:</strong> {moment(electronicTypeData?.created_at).format("YYYY-MM-DD HH:mm:ss")}
                            </p>
                            <p>
                                <strong>Updated At:</strong> {moment(electronicTypeData?.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                            </p>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Products">
                    <div>
                        <ProductsListPage electronicTypeData={electronicTypeData} loggedInUserData={getUserQuery?.data?.data} />
                    </div>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default ElectronicTypesViewPage;
