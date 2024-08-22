import React from "react";
import { Link } from "react-router-dom";
import UserList from "./UserList";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";
import { TabView, TabPanel } from "primereact/tabview";
import { BreadCrumb } from "primereact/breadcrumb";
import { Panel } from "primereact/panel";

// import ActivityLogsList from "./ActivityLogsList";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/themes/lara-light-green/theme.css";

function UserPage({ loggedInUserData }) {
    console.log("loggedInUserData user page : ", loggedInUserData);
    return (
        <div>
            <BreadcrumbNav />

            <UserList loggedInUserData={loggedInUserData} />
        </div>
    );
}

export default UserPage;
