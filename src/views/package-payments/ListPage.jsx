import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreateForm from "./CreateForm";

import EditForm from "./EditForm";

import { useNavigate } from "react-router-dom";

import { getAllPackagePayments, getPackagePaymentById, postPackagePayment, updatePackagePayment, deletePackagePaymentById } from "../../services/packages/package-payments-service";

import MuiTable from "../../components/general_components/MuiTable";
import { toast } from "react-toastify";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Panel } from "primereact/panel";

import useAuthContext from "../../context/AuthContext";
import useHandleQueryError from "../../hooks/useHandleQueryError";
import handleMutationError from "../../hooks/handleMutationError";

//
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function ListPage({ packageData, ...props }) {
    const { getUserQuery } = useAuthContext();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data, isLoading, isError, error, status } = useQuery({
        queryKey: ["package-payments", "get_by_package_id", packageData?.id],
        queryFn: () => getAllPackagePayments({ package_id: packageData?.id }),
    });
    console.log("🚀Payments ~ ListPage ~ data:", data);
    // useEffect(() => {
    //     if (isError) {
    //         console.log("Error fetching List of data :", error);
    //         error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
    //     }
    // }, [isError]);

    // Use the custom hook to handle errors with useMemo on the error object
    useHandleQueryError(isError, error);

    const [deleteMutationIsLoading, setDeleteMutationIsLoading] = useState(false);
    const deleteMutation = useMutation({
        mutationFn: (variables) => deletePackagePaymentById(variables),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["package-payments"]);
            setDeleteMutationIsLoading(false);
            toast.success("deleted Successfully");
        },
        onError: (error) => {
            // setDeleteMutationIsLoading(false);
            // error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
            // Custom hook to handle mutation error
            handleMutationError(error, setDeleteMutationIsLoading);
        },
    });

    // const handleDelete = async (event, id) => {
    //     var result = window.confirm("Are you sure you want to delete?");
    //     if (result === true) {
    //         ProgramDeleteMutation.mutate(id);
    //     }
    // };

    const handleDelete = (event, id) => {
        let selectedDeleteId = id;
        confirmDialog({
            message: "Are you sure you want to delete?",
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => confirmDelete(selectedDeleteId),
            reject: cancelDelete,
        });
    };

    const confirmDelete = (selectedDeleteId) => {
        if (selectedDeleteId !== null) {
            setDeleteMutationIsLoading(true);
            deleteMutation.mutate(selectedDeleteId);
        }
    };

    const cancelDelete = () => {
        // setDeleteProgramId(null);
    };

    const [selectedItem, setSelectedItem] = useState();

    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showBudjetOutPutAddForm, setShowBudjetOutPutAddForm] = useState(false);

    const handleShowEditForm = (item) => {
        setSelectedItem(item);
        setShowEditForm(true);
        console.log("handleShowEditForm is : ", item);
    };
    const handleCloseEditForm = () => {
        setSelectedItem({ id: null });
        setShowEditForm(false);
    };

    // const activeUser = localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")) : undefined;
    const activeUser = getUserQuery?.data?.data;

    const onFormClose = () => {
        setShowAddForm(false);
    };

    const onBudjetOutPutFormClose = () => {
        setShowBudjetOutPutAddForm(false);
    };

    ///=================
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    const handlePackageClick = (products) => {
        setSelectedProducts(products);
        setIsDialogVisible(true);
    };

    let tableId = 0;
    const columns = [
        {
            title: "#",
            width: "5%",
            field: "id",
            // render: (rowData) => {
            //     // tableId = rowData.tableData.id;
            //     tableId = tableId++;
            //     return <div>{rowData.tableData.index + 1}</div>;
            //     // return <div>{rowData.tableData.id}</div>;
            // },
        },
        {
            title: "Package Number",
            field: "package.package_number",
            render: (rowData) => {
                return <div>{rowData?.package?.package_number}</div>;
            },
        },
        {
            title: "Customer",
            field: "customer.name",
        },
        {
            title: "Amount",
            field: "amount",
            render: (rowData) => {
                return rowData.amount ? parseFloat(rowData.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "No amount";
            },
        },
        {
            title: "Payment Method",
            field: "payment_method",
        },
        {
            title: "Transaction Number",
            field: "transaction_number",
        },
        {
            title: "Details",
            field: "details",
        },
        {
            title: "Created By Name",
            field: "created_by.name",
            hidden: false,
        },
        {
            title: "Created By Email",
            field: "created_by.email",
            hidden: true,
        },

        {
            title: "Created At",
            field: "created_at",
            hidden: true,
            render: (rowData) => {
                return moment(rowData.created_at).format("lll");
            },
        },

        {
            title: "Updated By Name",
            field: "updated_by.name",
            hidden: false,
        },
        {
            title: "Updated By Email",
            field: "updated_by.email",
            hidden: true,
        },

        {
            title: "Updated At",
            field: "updated_at",
            hidden: true,
            render: (rowData) => {
                return moment(rowData.updated_at).format("lll");
            },
        },
    ];

    return (
        <div style={{ width: "100%" }}>
            {/* <div className="col-12 xl:col-12">
                <div className="card">
                    <p>Funders Are Attched onto subprojects</p>
                </div>
            </div> */}
            <Panel header="Package Payments" style={{ marginBottom: "20px" }} toggleable>
                <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                    {activeUser?.permissions.includes("create") && <Button label="Add Payment" className="p-button-primary" onClick={() => setShowAddForm(true)} />}
                    <CreateForm show={showAddForm} onHide={() => setShowAddForm(false)} onClose={onFormClose} packageData={packageData} />
                </div>

                <MuiTable
                    tableTitle="Payments"
                    tableData={data?.data?.data ?? []}
                    tableColumns={columns}
                    handleShowEditForm={handleShowEditForm}
                    handleDelete={(e, item_id) => handleDelete(e, item_id)}
                    showEdit={activeUser?.permissions.includes("update")}
                    showDelete={activeUser?.permissions.includes("delete")}
                    loading={isLoading || status === "loading" || deleteMutationIsLoading}
                    //
                    // hideRowEdit={(rowData) => (rowData?.delivery_status === "received" ? true : false)}
                    // //
                    // handleViewPage={(rowData) => {
                    //     navigate("order", { state: { orderData: rowData } });
                    // }}
                    // showViewPage={true}
                    // hideRowViewPage={false}
                    //
                    //
                    exportButton={true}
                    pdfExportTitle="Payments"
                    csvExportTitle="Payments"
                />

                {selectedItem && <EditForm rowData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} />}

                {/* Dialog to show products */}
                {/* <Dialog header="Products in Order" maximizable visible={isDialogVisible} style={{ minWidth: "50vw" }} onHide={() => setIsDialogVisible(false)}>
                    <DataTable value={selectedProducts} responsiveLayout="scroll">
                        <Column field="image" header="Image" body={(rowData) => <Image src={rowData.product.cloudinary_photo_url || rowData.product.photo_url} alt={rowData.product.name} width="100" preview />} />
                        <Column field="name" header="Name" sortable body={(rowData) => rowData.product.name} />
                        <Column field="price" header="Price" sortable body={(rowData) => `(UGX) ${rowData.price}`} />
                        <Column field="quantity" header="Quantity" sortable body={(rowData) => rowData.quantity} />
                        <Column field="created_at" header="Created At" sortable body={(rowData) => moment(rowData.created_at).format("YYYY-MM-DD HH:mm:ss")} />
                        <Column field="updated_at" header="Updated At" sortable body={(rowData) => moment(rowData.updated_at).format("YYYY-MM-DD HH:mm:ss")} />
                    </DataTable>
                </Dialog> */}
            </Panel>
        </div>
    );
}

export default ListPage;
