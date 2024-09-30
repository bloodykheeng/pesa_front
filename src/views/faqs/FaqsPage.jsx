import React from "react";
import ListPage from "./ListPage";

import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";
import useAuthContext from "../../context/AuthContext";

//
function FaqsPage({ loggedInUserData }) {
    const { getUserQuery } = useAuthContext();
    return (
        <div>
            <BreadcrumbNav />

            <ListPage loggedInUserData={getUserQuery?.data?.data} />
        </div>
    );
}

export default FaqsPage;
