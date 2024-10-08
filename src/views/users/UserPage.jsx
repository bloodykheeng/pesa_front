import React from "react";
import { Link } from "react-router-dom";
import UserList from "./UserList";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";
import { TabView, TabPanel } from "primereact/tabview";
import { BreadCrumb } from "primereact/breadcrumb";
import { Panel } from "primereact/panel";
import RolesList from "./old-components/roles/RolesList";
import PermissionsList from "./old-components/permissions/PermissionsList.js";
// import ActivityLogsList from "./ActivityLogsList";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/themes/lara-light-green/theme.css";
import RolesPage from "./roles/RolesPage";
import PermissionsPage from "./permissions/PermissionsPage";

//
import useAuthContext from "../../context/AuthContext";

function UserPage() {
    const { getUserQuery } = useAuthContext();
    const loggedInUserData = getUserQuery?.data?.data;
    console.log("loggedInUserData user page : ", loggedInUserData);
    return (
        <div>
            <BreadcrumbNav />
            <Panel header="User Management">
                <TabView className="m-3">
                    {loggedInUserData?.permissions?.includes("view users") && (
                        <TabPanel header="Users">
                            <UserList loggedInUserData={loggedInUserData} />
                        </TabPanel>
                    )}
                    {loggedInUserData?.permissions?.includes("view roles") && (
                        <TabPanel header="Roles">
                            <div style={{ width: "100%", minHeight: "100vh", padding: "1rem" }}>
                                <RolesPage loggedInUserData={loggedInUserData} />
                            </div>
                        </TabPanel>
                    )}
                    {loggedInUserData?.permissions?.includes("view permissions") && (
                        <TabPanel header="Permissions">
                            <div style={{ width: "100%", minHeight: "100vh", padding: "1rem" }}>
                                <PermissionsPage />
                            </div>
                        </TabPanel>
                    )}

                    {/* {loggedInUserData?.permissions?.includes("view permissions") && (
                    <TabPanel header="Logs">
                        <div style={{ width: "100%", minHeight: "100vh", padding: "1rem" }}>
                            <ActivityLogsList loggedInUserData={loggedInUserData} />
                        </div>
                    </TabPanel>
                )} */}
                </TabView>
            </Panel>
        </div>
    );
}

export default UserPage;
