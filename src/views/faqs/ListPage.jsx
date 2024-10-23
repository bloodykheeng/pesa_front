import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreateForm from "./CreateForm";

import EditForm from "./EditForm";

import moment from "moment";

import { useNavigate } from "react-router-dom";

import { getAllFaqs, getFaqById, postFaq, updateFaq, deleteFaqById } from "../../services/faqs/faqs-service";

import { Dropdown } from "primereact/dropdown";
import MuiTable from "../../components/general_components/MuiTable";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Panel } from "primereact/panel";

//
import useHandleQueryError from "../../hooks/useHandleQueryError";
import handleMutationError from "../../hooks/handleMutationError";
function ListPage({ loggedInUserData, productCategoryBrandData, ...props }) {
    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const { data, isLoading, isError, error, status } = useQuery({
        queryKey: ["faqs"],
        queryFn: () => getAllFaqs(),
    });
    console.log("🚀 ~ Polls ListPage ~ data:", data?.data?.data);

    // Use the custom hook to handle errors with useMemo on the error object
    useHandleQueryError(isError, error);

    const [deleteMutationIsLoading, setDeleteMutationIsLoading] = useState(false);
    const deleteMutation = useMutation({
        mutationFn: (variables) => deleteFaqById(variables),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["faqs"]);
            toast.success("Deleted Successfully");
            setDeleteMutationIsLoading(false);
        },
        onError: (error) => {
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
    const activeUser = loggedInUserData;

    const onFormClose = () => {
        setShowAddForm(false);
    };

    let tableId = 0;
    const columns = [
        {
            title: "ID",
            width: "5%",
            field: "id",
            hidden: true,
        },
        {
            title: "Question",
            field: "question",
        },
        {
            title: "Answer",
            field: "answer",
        },

        {
            title: "Date",
            field: "created_at",
            hidden: true,
            render: (rowData) => {
                return moment(rowData?.created_at).format("lll");
            },
        },

        {
            title: "Created By Name",
            field: "created_by.name",
            hidden: true,
        },
        {
            title: "Created By Email",
            field: "created_by.email",
            hidden: true,
        },
    ];

    return (
        <div style={{ width: "100%" }}>
            {/* <div className="col-12 xl:col-12">
                <div className="card">
                    <p>Funders Are Attched onto subprojects</p>
                </div>
            </div> */}
            <Panel header="Faqs" style={{ marginBottom: "20px" }} toggleable>
                <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                    {activeUser?.permissions.includes("create") && <Button label="Add Faq" className="p-button-primary" onClick={() => setShowAddForm(true)} />}
                    <CreateForm show={showAddForm} onHide={() => setShowAddForm(false)} onClose={onFormClose} productCategoryBrandData={productCategoryBrandData} />
                </div>

                <MuiTable
                    tableTitle="Faqs"
                    tableData={data?.data?.data ?? []}
                    tableColumns={columns}
                    handleShowEditForm={handleShowEditForm}
                    handleDelete={(e, item_id) => handleDelete(e, item_id)}
                    showEdit={activeUser?.permissions.includes("update")}
                    showDelete={activeUser?.permissions.includes("delete")}
                    loading={isLoading || status === "loading" || deleteMutationIsLoading}
                    // //
                    // handleViewPage={(rowData) => {
                    //     navigate("product-category-brand", { state: { productCategoryBrandData: rowData } });
                    // }}
                    // showViewPage={true}
                    // hideRowViewPage={false}
                    //
                    exportButton={true}
                    pdfExportTitle="Faqs"
                    csvExportTitle="Faqs"
                />

                {selectedItem && <EditForm rowData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} />}
            </Panel>
        </div>
    );
}

export default ListPage;
