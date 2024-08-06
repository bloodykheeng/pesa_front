import React from "react";

// material-ui
import Typography from "@mui/material/Typography";

// project import

import ListRecords from "./ListRecords";

function PermissionsPage() {
    return (
        <div className="card">
            <h2>List of all Permissions</h2>

            <ListRecords />
        </div>
    );
}

export default PermissionsPage;
