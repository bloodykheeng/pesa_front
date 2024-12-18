import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import ListPage from "../payments/ListPage";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";
import useAuthContext from "../../context/AuthContext";

//
import { Image } from "primereact/image";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

//
import EditForm from "./EditForm";
import { Button } from "primereact/button";

const OrdersViewPage = () => {
    const { getUserQuery } = useAuthContext();
    const location = useLocation();
    const { orderData } = location.state;
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

    let activeUser = getUserQuery?.data?.data;
    console.log("🚀 ~ OrdersViewPage ~ activeUser:", activeUser);

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
                <TabPanel header="Order Details">
                    <div style={{ minHeight: "50vh", display: "flex", gap: "1rem", flexWrap: "wrap", flexDirection: "column" }}>
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
                                <Button label="Edit Order" className="p-button-primary" onClick={() => handleShowEditForm(orderData)} />
                            </div>
                        )}

                        {selectedItem && <EditForm rowData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} />}

                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                            <div>
                                <p>
                                    <strong>Order Number: </strong>
                                    <span>{orderData?.order_number}</span>
                                </p>
                                <p>
                                    <strong>Address: </strong> {orderData?.address}
                                </p>
                                <p>
                                    <strong>Payment Mode: </strong> {orderData?.payment_mode}
                                </p>
                                <p>
                                    <strong>Payment Status: </strong>
                                    <span style={{ color: getStatusColor(orderData?.payment_status), fontWeight: "bold" }}>{orderData?.payment_status?.charAt(0).toUpperCase() + orderData?.payment_status?.slice(1)}</span>
                                </p>
                                <p>
                                    <strong>Amount: </strong>
                                    {orderData?.amount ? parseFloat(orderData.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "No amount"}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>Delivery Status: </strong>
                                    <span style={{ color: getDeliveryStatusColor(orderData?.delivery_status), fontWeight: "bold" }}>{orderData?.delivery_status?.charAt(0).toUpperCase() + orderData?.delivery_status?.slice(1)}</span>
                                </p>
                                <p>
                                    <strong>Charged Amount: </strong>
                                    {orderData?.charged_amount ? parseFloat(orderData.charged_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "No charged amount"}
                                </p>
                                <p>
                                    <strong>Created At: </strong> {moment(orderData?.created_at).format("YYYY-MM-DD HH:mm:ss")}
                                </p>
                                <p>
                                    <strong>Created By Name:</strong> {orderData?.created_by?.name}
                                </p>
                                <p>
                                    <strong>Created By Email:</strong> {orderData?.created_by?.email}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>Updated By Name:</strong> {orderData?.updated_by?.name}
                                </p>
                                <p>
                                    <strong>Updated By Email:</strong> {orderData?.updated_by?.email}
                                </p>
                                <p>
                                    <strong>Updated At:</strong> {moment(orderData?.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                                </p>
                            </div>
                        </div>
                        <div style={{ maxWidth: "100%" }}>
                            <h3>Order Products</h3>
                            <DataTable value={orderData?.order_products} responsiveLayout="scroll">
                                {/* <Column field="image" header="Image" body={(rowData) => <Image src={rowData.product.cloudinary_photo_url || rowData.product.photo_url} alt={rowData.product.name} height="30" preview />} /> */}
                                <Column field="image" header="Image" body={(rowData) => <Image src={`${process.env.REACT_APP_IMAGE_BASE_URL}${rowData?.product?.photo_url}`} alt={rowData?.name} height="30" preview />} />
                                <Column field="name" header="Name" sortable body={(rowData) => rowData?.name} />
                                <Column field="price" header="Price" sortable body={(rowData) => `(UGX) ${rowData?.price}`} />
                                <Column field="quantity" header="Quantity" sortable body={(rowData) => rowData?.quantity} />
                                <Column field="created_at" header="Created At" sortable body={(rowData) => moment(rowData?.created_at).format("YYYY-MM-DD HH:mm:ss")} />
                                <Column field="updated_at" header="Updated At" sortable body={(rowData) => moment(rowData?.updated_at).format("YYYY-MM-DD HH:mm:ss")} />
                            </DataTable>
                        </div>
                    </div>

                    {/* Add more details as needed */}
                </TabPanel>
                <TabPanel header="Payments">
                    <div>
                        <ListPage orderData={orderData} loggedInUserData={getUserQuery?.data?.data} />
                    </div>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default OrdersViewPage;
