import React from "react";
import Notifications from "./Notifications";

import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";
import useAuthContext from "../../context/AuthContext";

//
function NotificationsPage({ loggedInUserData }) {
    const { getUserQuery } = useAuthContext();
    return (
        <div>
            <BreadcrumbNav />

            <Notifications loggedInUserData={getUserQuery?.data?.data} />
        </div>
    );
}

export default NotificationsPage;
