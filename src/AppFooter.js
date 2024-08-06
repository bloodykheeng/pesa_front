import React from "react";

export const AppFooter = (props) => {
    return (
        <div className="layout-footer">
            <img
                src={props.layoutColorMode === "light" ? "assets/pesa_photos/pesa_with_green_bg.jpg" : "assets/pesa_photos/pesa_with_green_bg.jpg"}
                alt="Logo"
                //  height="20"
                style={{ height: "50px" }}
                className="mr-2"
            />
            by
            <span className="font-medium ml-2" style={{ cursor: "auto", color: "var(--primary-color)", fontWeight: "700" }}>
                ELEVATE PESA
            </span>
        </div>
    );
};
