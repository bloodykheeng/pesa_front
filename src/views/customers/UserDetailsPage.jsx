import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import moment from "moment";
import "primeicons/primeicons.css"; // Ensure PrimeIcons are imported for use

function UserDetailsPage({ user, showModal, handleCloseModal }) {
    console.log("userDetail xxxxxx : ", user);
    return (
        <Dialog header="Bio Data" visible={showModal} onHide={handleCloseModal} maximizable modal>
            <div style={{ margin: "1rem" }}>
                {" "}
                <Panel header="Bio" toggleable>
                    <div className="p-grid">
                        <div className="p-col-12 p-md-6">
                            <strong>Name:</strong> {user?.name}
                        </div>

                        <div className="p-col-12 p-md-6">
                            <strong>Email:</strong> {user?.email}
                        </div>

                        <div className="p-col-12 p-md-6">
                            <strong>Status:</strong> {user?.status}
                        </div>

                        <div className="p-col-12 p-md-6">
                            <strong>Last Login:</strong> {user?.lastlogin}
                        </div>
                    </div>
                </Panel>
            </div>
            <div style={{ margin: "1rem" }}>
                {" "}
                <Panel header="Work Details" toggleable>
                    <div className="p-grid">
                        <div className="p-col-12 p-md-6">
                            <strong>Role:</strong> {user?.role}
                        </div>
                        {["Admin", "Department Commissioner", "Assistant Commissioner", "District Water Engineer", "Project Manager", "Engineer", "Utility Manager"].includes(user?.role) && (
                            <div className="p-col-12 p-md-6">
                                <strong>Directorate:</strong> {user?.user_directorate?.directorate?.name}
                            </div>
                        )}
                        {["Department Commissioner", "Assistant Commissioner", "District Water Engineer", "Project Manager", "Engineer", "Utility Manager"].includes(user?.role) && (
                            <div className="p-col-12 p-md-6">
                                <strong>Department:</strong> {user?.user_department?.department?.name}
                            </div>
                        )}
                        {["District Water Engineer", "Project Manager", "Engineer"].includes(user?.role) && (
                            <div className="p-col-12 p-md-6">
                                <strong>Department Administration:</strong> {user?.department_administration?.department_administration?.name}
                            </div>
                        )}
                        {["Project Manager", "Engineer"].includes(user?.role) && (
                            <div className="p-col-12 p-md-6">
                                <strong>Project:</strong> {user?.user_project?.project?.project_title}
                            </div>
                        )}
                        {user?.role === "Engineer" && (
                            <div className="p-col-12 p-md-6">
                                <strong>Sub Project:</strong> {user?.user_sub_project?.sub_project?.name}
                            </div>
                        )}

                        {user?.role === "Utility Manager" && (
                            <div className="p-col-12 p-md-6">
                                <strong>Utility:</strong> {user?.user_utility?.utility?.name}
                            </div>
                        )}
                    </div>
                </Panel>
            </div>

            <div style={{ margin: "1rem" }}>
                <Panel header="Additional Information" toggleable>
                    <div className="p-field">
                        <strong>Created At:</strong> {moment(user?.created_at).format("MMMM Do, YYYY, h:mm:ss A")}
                    </div>
                </Panel>
            </div>

            {/* <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <Button label="Close" icon="pi pi-times" onClick={handleCloseModal} className="p-button-outlined p-button-secondary" />
            </div> */}
        </Dialog>
    );
}

export default UserDetailsPage;
