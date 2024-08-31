import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import OrdersListPage from "../orders/ListPage";
import PackagesListPage from "../packages/ListPage";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";
import useAuthContext from "../../context/AuthContext";

import { Image } from "primereact/image";

//
import EditForm from "./EditForm";
import { Button } from "primereact/button";

const UsersViewPage = () => {
    const { getUserQuery } = useAuthContext();
    const location = useLocation();
    const { customerData } = location.state;
    const [activeIndex, setActiveIndex] = useState(0);

    let activeUser = getUserQuery?.data?.data;
    //

    const [selectedItem, setSelectedItem] = useState();
    const [showEditForm, setShowEditForm] = useState(false);

    const handleShowEditForm = (item) => {
        setSelectedItem(item);
        setShowEditForm(true);
        console.log("handleShowEditForm is : ", item);
    };
    const handleCloseEditForm = () => {
        setSelectedItem({ id: null });
        setShowEditForm(false);
    };

    return (
        <div className="product-category-view">
            <BreadcrumbNav />
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Customer Details">
                    {activeUser?.permissions.includes("update") && (
                        <div
                            style={{
                                height: "3rem",
                                margin: "1rem",
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "1rem",
                            }}
                        >
                            <Button label="Edit Customer" className="p-button-primary" onClick={() => handleShowEditForm(customerData)} />
                        </div>
                    )}

                    {selectedItem && <EditForm rowData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} />}
                    <div style={{ minHeight: "50vh", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                        {/* Display Image */}
                        <div className="card flex justify-content-center">
                            {/* <Image src={customerData.cloudinary_photo_url} alt="Category Image" width="250" preview /> */}
                            {/* {customerData.cloudinary_photo_url ? <Image src={`${customerData.cloudinary_photo_url}`} alt={customerData.name} height="250" preview /> : <div style={{ width: "300px" }}>No Image</div>} */}
                            {customerData?.photo_url ? (
                                <Image src={`${process.env.REACT_APP_IMAGE_BASE_URL}${customerData?.photo_url}`} alt={customerData.name} height="250" preview />
                            ) : (
                                <div style={{ width: "300px", height: "250px", display: "flex", justifyContent: "center", alignItems: "center", border: "1px dashed #ccc" }}>No Image</div>
                            )}
                        </div>
                        <div>
                            <p>
                                <strong>Name:</strong> {customerData?.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {customerData?.email}
                            </p>
                            <p>
                                <strong>Status:</strong> {customerData?.status}
                            </p>
                            <p>
                                <strong>Last Login:</strong> {customerData?.lastlogin}
                            </p>

                            {/* <p>
                                <strong>Cloudinary Photo Public ID:</strong> {customerData?.cloudinary_photo_public_id}
                            </p> */}
                            <p>
                                <strong>Agree:</strong> {customerData?.agree ? "Yes" : "No"}
                            </p>
                            <p>
                                <strong>Phone:</strong> {customerData?.phone}
                            </p>
                            {/* <p>
                                <strong>Date of Birth:</strong> {customerData?.date_of_birth}
                            </p>
                            <p>
                                <strong>Gender:</strong> {customerData?.gender}
                            </p>
                            <p>
                                <strong>Device Token:</strong> {customerData?.device_token}
                            </p> */}
                            <p>
                                <strong>NIN:</strong> {customerData?.nin}
                            </p>
                            <p>
                                <strong>Created By:</strong> {customerData?.created_by?.name}
                            </p>
                            <p>
                                <strong>Updated By:</strong> {customerData?.updated_by?.name}
                            </p>
                            <p>
                                <strong>Created At:</strong> {moment(customerData?.created_at)?.format("YYYY-MM-DD HH:mm:ss")}
                            </p>
                            <p>
                                <strong>Updated At:</strong> {moment(customerData?.updated_at)?.format("YYYY-MM-DD HH:mm:ss")}
                            </p>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Customer Orders">
                    <div>
                        <OrdersListPage customerData={customerData} loggedIncustomerData={getUserQuery?.data?.data} />
                    </div>
                </TabPanel>
                <TabPanel header="Customer Packages">
                    <div>
                        <PackagesListPage customerData={customerData} loggedIncustomerData={getUserQuery?.data?.data} />
                    </div>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default UsersViewPage;
