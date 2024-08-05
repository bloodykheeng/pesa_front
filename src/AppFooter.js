import React from "react";

export const AppFooter = (props) => {
    return (
        <div className="layout-footer">
            <img
                src={props.layoutColorMode === "light" ? "assets/pesa_photos/mockups-logos-13.png" : "assets/pesa_photos/mockups-logos-13.png"}
                alt="Logo"
                //  height="20"
                style={{ height: "20px" }}
                className="mr-2"
            />
            by
            <span className="font-medium ml-2">ELEVATE PESA</span>
        </div>
    );
};
