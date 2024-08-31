import React, { useEffect, useState } from "react";

// material-ui
import Typography from "@mui/material/Typography";

// project import
import RowForm from "./widgets/RowForm";
import { getAllRolesAndModifiedPermissionsService, syncPermissionToRoleService } from "../../../services/roles/roles-service";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress

//
import useHandleQueryError from "../../../hooks/useHandleQueryError";
import handleMutationError from "../../../hooks/handleMutationError";

function RolesPage() {
    const getListOfRolesAndModifiedPermissionServices = useQuery({
        queryKey: ["roles-with-modified-permissions"],
        queryFn: () => getAllRolesAndModifiedPermissionsService(),
    });

    // Use the custom hook to handle errors with useMemo on the error object
    useHandleQueryError(getListOfRolesAndModifiedPermissionServices?.isError, getListOfRolesAndModifiedPermissionServices?.error);

    console.log("getListOfRolesAndModifiedPermissionServices list : ", getListOfRolesAndModifiedPermissionServices?.data?.data);
    return (
        <div className="card">
            <Typography variant="body2">Easily Manage Permissions under roles</Typography>
            <br />
            <div>
                {getListOfRolesAndModifiedPermissionServices?.isLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <CircularProgress /> {/* Loading indicator */}
                    </div>
                ) : (
                    <RowForm rolesAndModifiedPermissionData={getListOfRolesAndModifiedPermissionServices?.data?.data} />
                )}
            </div>
        </div>
    );
}

export default RolesPage;
