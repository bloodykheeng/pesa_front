import React, { useEffect, useState } from "react";

import { getAllRoles } from "../../../../services/roles/roles-service";

import WaterIsLoading from "../../../../components/general_components/WaterIsLoading";
import moment from "moment";
import { Link } from "react-router-dom";
import MuiTable from "../../../../components/general_components/MuiTable";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import RolesPermissionModal from "./RolesPermissionModal.jsx";
import { toast } from "react-toastify";

function RolesList() {
    const [permissionShowModal, setPermissionShowModal] = useState(false);
    const [permissionList, setPermissionList] = useState(false);
    const [roleName, setRoleName] = useState();
    const [roleId, setRoleId] = useState();

    const handleOpenPermissionModal = () => {
        setPermissionShowModal(true);
    };

    const handleClosePermissionModal = () => {
        setPermissionShowModal(false);
    };
    let tableId = 0;
    const columns = [
        {
            title: "#",
            width: "5%",
            field: "id",
            hidden: true,
        },
        {
            title: "Role",
            field: "name",
            cellStyle: {
                whiteSpace: "nowrap",
                padding: "8px",
            },
            render: (rowData) => {
                return (
                    <div
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => {
                            setPermissionList(rowData?.permissions);
                            setRoleName(rowData?.name);
                            setRoleId(rowData?.id);
                            handleOpenPermissionModal();
                        }}
                    >
                        {rowData?.name}
                    </div>
                );
            },
        },
        {
            title: "Guard Name",
            field: "guard_name",
        },
    ];
    const getListOfRoles = useQuery({ queryKey: ["usersroles"], queryFn: getAllRoles });
    console.log("getListOfRoles : ", getListOfRoles);

    useEffect(() => {
        if (getListOfRoles?.isError) {
            console.log("Error fetching List of Users :", getListOfRoles?.error);
            getListOfRoles?.error?.response?.data?.message ? toast.error(getListOfRoles?.error?.response?.data?.message) : !getListOfRoles?.error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        }
    }, [getListOfRoles?.isError]);
    return (
        <div>
            <div>
                <MuiTable tableTitle="Roles" tableData={getListOfRoles?.data?.data ?? []} tableColumns={columns} loading={getListOfRoles.isLoading || getListOfRoles.status == "loading"} />
                {(getListOfRoles.isLoading || getListOfRoles.status == "loading") && <WaterIsLoading />}
                <RolesPermissionModal roleName={roleName} permissions={permissionList} showModal={permissionShowModal} handleCloseModal={handleClosePermissionModal} roleId={roleId} />
            </div>
        </div>
    );
}

export default RolesList;
