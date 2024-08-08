import React from "react";
import ListPage from "./ListPage";
import { Link } from "react-router-dom";

import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";
import useAuthContext from "../../context/AuthContext";

//
function BrandOptionProductsPage({ loggedInUserData }) {
    const { getUserQuery } = useAuthContext();
    return (
        <div>
            <BreadcrumbNav />

            <ListPage loggedInUserData={getUserQuery?.data?.data} />
        </div>
    );
}

export default BrandOptionProductsPage;
