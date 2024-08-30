import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import ListPage from "../package-payments/ListPage";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";
import useAuthContext from "../../context/AuthContext";

//
import { Image } from "primereact/image";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const PackagesViewPage = () => {
    const { getUserQuery } = useAuthContext();
    const location = useLocation();
    const { packageData } = location.state;
    const [activeIndex, setActiveIndex] = useState(0);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "orange";
            case "paid":
                return "green";
            case "cancelled":
                return "red";
            default:
                return "gray";
        }
    };

    const getDeliveryStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "orange";
            case "processing":
                return "blue";
            case "transit":
                return "purple";
            case "delivered":
            case "received":
                return "green";
            case "cancelled":
                return "red";
            default:
                return "gray";
        }
    };

    return (
        <div className="product-category-view">
            <BreadcrumbNav />
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Package Order Details">
                    <div style={{ minHeight: "50vh", display: "flex", gap: "1rem", flexWrap: "wrap", flexDirection: "column" }}>
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                            {/* Display Image */}
                            <div className="card flex justify-content-center">
                                {/* <Image src={productCategoryData.cloudinary_photo_url} alt="Category Image" width="250" preview /> */}
                                <Image src={`${process.env.REACT_APP_IMAGE_BASE_URL}${packageData?.photo_url}`} alt="package Image" width="250" preview />
                            </div>
                            <div>
                                <p>
                                    <strong>Package Number: </strong>
                                    <span>{packageData?.package_number}</span>
                                </p>
                                <p>
                                    <strong>Pickup: </strong> {packageData?.pickup}
                                </p>
                                <p>
                                    <strong>Destination: </strong> {packageData?.destination}
                                </p>
                                <p>
                                    <strong>Payment Mode: </strong> {packageData?.payment_mode}
                                </p>
                                <p>
                                    <strong>Payment Status: </strong>
                                    <span style={{ color: getStatusColor(packageData?.payment_status), fontWeight: "bold" }}>{packageData?.payment_status?.charAt(0).toUpperCase() + packageData?.payment_status?.slice(1)}</span>
                                </p>
                                <p>
                                    <strong>Amount Paid: </strong>
                                    {packageData?.amount_paid ? parseFloat(packageData.amount_paid).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "No amount paid"}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>Delivery Status: </strong>
                                    <span style={{ color: getDeliveryStatusColor(packageData?.delivery_status), fontWeight: "bold" }}>{packageData?.delivery_status?.charAt(0).toUpperCase() + packageData?.delivery_status?.slice(1)}</span>
                                </p>
                                <p>
                                    <strong>Charged Amount: </strong>
                                    {packageData?.charged_amount ? parseFloat(packageData.charged_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "No charged amount"}
                                </p>
                                <p>
                                    <strong>Created At: </strong> {moment(packageData?.created_at).format("YYYY-MM-DD HH:mm:ss")}
                                </p>
                                <p>
                                    <strong>Created By Name:</strong> {packageData?.created_by?.name}
                                </p>
                                <p>
                                    <strong>Created By Email:</strong> {packageData?.created_by?.email}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>Updated By Name:</strong> {packageData?.updated_by?.name}
                                </p>
                                <p>
                                    <strong>Updated By Email:</strong> {packageData?.updated_by?.email}
                                </p>
                                <p>
                                    <strong>Updated At:</strong> {moment(packageData?.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Add more details as needed */}
                </TabPanel>
                <TabPanel header="Package Payments">
                    <div>
                        <ListPage packageData={packageData} loggedInUserData={getUserQuery?.data?.data} />
                    </div>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default PackagesViewPage;
