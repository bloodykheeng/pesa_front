import React, { useEffect, useState } from "react";

import { getAllUsers, getUserById, getApproverRoles, createUser, updateUser, deleteUserById, getAssignableRoles } from "../../services/auth/user-service";
import EditForm from "./EditForm";
import CreateForm from "./CreateForm";
import WaterIsLoading from "../../components/general_components/WaterIsLoading";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import MuiTable from "../../components/general_components/MuiTable";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import UserDetailsPage from "./UserDetailsPage";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";

import { Panel } from "primereact/panel";
import { Image } from "primereact/image";

function UserList({ loggedInUserData }) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState({ id: null });

    const [showUserForm, setShowUserForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userDetailShowModal, setUserDetailShowModal] = useState(false);
    const [userDetail, setUserDetail] = useState();

    const handleOpenuserDetailModal = (rowData) => {
        setUserDetail(rowData);
        setUserDetailShowModal(true);
    };

    const handleCloseuserDetailModal = () => {
        setUserDetailShowModal(false);
    };

    const handleShowEditForm = (item) => {
        setSelectedItem(item);
        setShowEditForm(true);
    };
    const handleCloseEditForm = () => {
        setSelectedItem({ id: null });
        setShowEditForm(false);
    };

    const handleShowUserForm = () => {
        setShowUserForm(true);
    };
    const handleCloseUserForm = () => {
        setShowUserForm(false);
    };

    const getListOfUsers = useQuery({ queryKey: ["users", "role", "Customer"], queryFn: () => getAllUsers({ role: "Customer" }) });
    console.log("users list : ", getListOfUsers?.data?.data);

    useEffect(() => {
        if (getListOfUsers?.isError) {
            console.log("Error fetching List of Users :", getListOfUsers?.error);
            getListOfUsers?.error?.response?.data?.message ? toast.error(getListOfUsers?.error?.response?.data?.message) : !getListOfUsers?.error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        }
    }, [getListOfUsers?.isError]);
    console.log("Customers list data : ", getListOfUsers?.data?.data);

    const [deleteMutationIsLoading, setDeleteMutationIsLoading] = useState(false);
    const deleteMutation = useMutation({
        mutationFn: deleteUserById,
        onSuccess: (data) => {
            queryClient.resetQueries(["users"]);
            setLoading(false);
            setDeleteMutationIsLoading(false);
            toast.success("deleted Successfully");
            console.log("deleted user succesfully ooooo: ");
        },
        onError: (error) => {
            console.log("The error is : ", error);
            toast.error("An error occurred!");
            setDeleteMutationIsLoading(false);
            setLoading(false);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        },
    });

    // const handleDelete = async (event, id) => {
    //     console.log("users is xxxxx : ", id);
    //     var result = window.confirm("Are you sure you want to delete? ");
    //     if (result === true) {
    //         setLoading(true);
    //         deleteUserMutation.mutate(id);
    //     }
    // };

    const handleDelete = (event, id) => {
        console.log("Delete Id Is : ", id);

        let deleteUserId = id;
        confirmDialog({
            message: "Are you sure you want to delete?",
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => confirmDelete(deleteUserId),
            reject: cancelDelete,
        });
    };

    const confirmDelete = (deleteUserId) => {
        if (deleteUserId !== null) {
            console.log("Ohh Yea delete User Id Not Null");
            deleteMutation.mutate(deleteUserId);
        }
    };

    const cancelDelete = () => {
        // setDeleteDirectorateId(null);
    };

    let tableId = 0;

    const columns = [
        {
            title: "#",
            width: "5%",
            field: "name",
            render: (rowData) => {
                tableId = rowData.tableData.id;
                tableId++;
                return <div>{rowData.tableData.id}</div>;
            },
        },
        {
            title: "Photo",
            field: "cloudinary_photo_url",
            render: (rowData) => {
                return rowData.cloudinary_photo_url ? <Image src={`${rowData.cloudinary_photo_url}`} alt={rowData.name} height="30" preview style={{ verticalAlign: "middle" }} /> : <div>No Image</div>;
            },
        },
        {
            title: "Name",
            field: "name",
            render: (rowData) => {
                return (
                    <span style={{ color: "blue", cursor: "pointer" }} onClick={() => handleOpenuserDetailModal(rowData)}>
                        {rowData?.name}
                    </span>
                );
            },
        },
        {
            title: "Email",
            field: "email",
        },
        {
            title: "Role",
            field: "role",
        },
        {
            title: "status",
            field: "status",
        },
        {
            title: "lastlogin",
            field: "lastlogin",
        },
    ];

    return (
        <div style={{ width: "100%" }}>
            <Panel header="Customers" style={{ marginBottom: "20px" }} toggleable>
                <div>
                    <div xs={12}>
                        {/* <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                            {loggedInUserData?.permissions?.includes("create user") && (
                                <div>
                                    <div md={12} className="text-end">
                                        <Button onClick={() => handleShowUserForm()}>Add Customers</Button>
                                    </div>
                                </div>
                            )}
                        </div> */}
                        <div>
                            <div>
                                <MuiTable
                                    tableTitle="Customers"
                                    tableData={getListOfUsers?.data?.data?.data ?? []}
                                    tableColumns={columns}
                                    handleShowEditForm={handleShowEditForm}
                                    handleDelete={(e, item_id) => handleDelete(e, item_id)}
                                    showEdit={loggedInUserData?.permissions?.includes("update user")}
                                    showDelete={loggedInUserData?.permissions?.includes("delete user")}
                                    loading={loading || getListOfUsers.isLoading || getListOfUsers.status == "loading" || deleteMutationIsLoading}
                                    //
                                    handleViewPage={(rowData) => {
                                        navigate("customer", { state: { customerData: rowData } });
                                    }}
                                    showViewPage={true}
                                    hideRowViewPage={false}
                                    //
                                    exportButton={true}
                                    pdfExportTitle="Customers"
                                    csvExportTitle="Customers"
                                />

                                <UserDetailsPage user={userDetail} showModal={userDetailShowModal} handleCloseModal={handleCloseuserDetailModal} />
                                <EditForm rowData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} loggedInUserData={loggedInUserData} />
                                <CreateForm show={showUserForm} onHide={handleCloseUserForm} onClose={handleCloseUserForm} loggedInUserData={loggedInUserData} />
                                {/* {(getListOfUsers.isLoading || getListOfUsers.status == "loading") && <WaterIsLoading />} */}
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>
        </div>
    );
}

export default UserList;
