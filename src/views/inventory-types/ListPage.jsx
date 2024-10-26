import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreateForm from "./CreateForm";

import EditForm from "./EditForm";

import moment from "moment";

import { useNavigate } from "react-router-dom";

import { getAllInventoryTypes, getInventoryTypeById, postInventoryType, updateInventoryType, deleteInventoryTypeById } from "../../services/products/inventory_types-service";

import MuiTable from "../../components/general_components/MuiTable";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Panel } from "primereact/panel";
import { Image } from "primereact/image";

import useAuthContext from "../../context/AuthContext";
import useHandleQueryError from "../../hooks/useHandleQueryError";
import handleMutationError from "../../hooks/handleMutationError";

function ListPage({ ...props }) {
    const { getUserQuery } = useAuthContext();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data, isLoading, isError, error, status } = useQuery({
        queryKey: ["inventory-types"],
        queryFn: getAllInventoryTypes,
    });
    console.log("🚀Inventory Types ~ ListPage ~ data:", data);
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
        mutationFn: (variables) => deleteInventoryTypeById(variables),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["inventory-types"]);
            setDeleteMutationIsLoading(false);
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
            title: "Name",
            field: "name",
        },
        {
            title: "Code",
            field: "code",
        },
        {
            title: "Details",
            field: "details",
        },

        {
            title: "Photo",
            field: "photo_url",
            hidden: true,
            render: (rowData) => {
                return rowData.photo_url ? <Image src={`${process.env.REACT_APP_IMAGE_BASE_URL}${rowData.photo_url}`} alt={rowData.name} width="100" preview style={{ verticalAlign: "middle" }} /> : <div>No Image</div>;
            },
        },

        // {
        //     title: "Photo",
        //     field: "cloudinary_photo_url",
        //     render: (rowData) => {
        //         return rowData.cloudinary_photo_url ? <Image src={`${rowData.cloudinary_photo_url}`} alt={rowData.name} height="30" preview style={{ verticalAlign: "middle" }} /> : <div>No Image</div>;
        //     },
        // },

        {
            title: "Date",
            field: "created_at",
            render: (rowData) => {
                return moment(rowData.created_at).format("lll");
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
            <Panel header="Inventory Types" style={{ marginBottom: "20px" }} toggleable>
                <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                    {activeUser?.permissions.includes("create") && <Button label="Add Inventory Type" className="p-button-primary" onClick={() => setShowAddForm(true)} />}
                    <CreateForm show={showAddForm} onHide={() => setShowAddForm(false)} onClose={onFormClose} projectId={props?.projectId} />
                </div>

                <MuiTable
                    tableTitle="Inventory Types"
                    tableData={data?.data?.data ?? []}
                    tableColumns={columns}
                    handleShowEditForm={handleShowEditForm}
                    handleDelete={(e, item_id) => handleDelete(e, item_id)}
                    showEdit={activeUser?.permissions.includes("update")}
                    showDelete={activeUser?.permissions.includes("delete")}
                    loading={isLoading || status === "loading" || deleteMutationIsLoading}
                    // //
                    // handleViewPage={(rowData) => {
                    //     navigate("category", { state: { InventoryCategoryData: rowData } });
                    // }}
                    // showViewPage={true}
                    // hideRowViewPage={false}
                    //
                    //
                    exportButton={true}
                    pdfExportTitle="Inventory Types"
                    csvExportTitle="Inventory Types"
                />

                {selectedItem && <EditForm rowData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} />}
            </Panel>
        </div>
    );
}

export default ListPage;
