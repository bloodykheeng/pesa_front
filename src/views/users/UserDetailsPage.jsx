import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { Image } from "primereact/image";
import moment from "moment";
import "primeicons/primeicons.css";

function UserDetailsPage({ user, showModal, handleCloseModal }) {
    return (
        <Dialog header="User Details" visible={showModal} onHide={handleCloseModal} maximizable modal className="p-fluid">
            <div className="p-grid">
                <div className="p-col-12 p-md-6">
                    <Panel header="Profile Image" toggleable>
                        <div className="card flex justify-content-center p-2">
                            {/* {user?.cloudinary_photo_url ? <Image src={user.cloudinary_photo_url} alt={user.name} height="250" preview /> : <div style={{ width: "300px", height: "250px", display: "flex", justifyContent: "center", alignItems: "center", border: "1px dashed #ccc" }}>No Image</div>} */}
                            {user?.photo_url ? (
                                <Image src={`${process.env.REACT_APP_IMAGE_BASE_URL}${user?.photo_url}`} alt={user.name} height="250" preview />
                            ) : (
                                <div style={{ width: "300px", height: "250px", display: "flex", justifyContent: "center", alignItems: "center", border: "1px dashed #ccc" }}>No Image</div>
                            )}
                        </div>
                    </Panel>
                </div>
                <div className="p-col-12 p-md-6">
                    <Panel header="Bio Data" toggleable>
                        <div className="p-grid p-2">
                            <div className="p-col-12">
                                <strong>Name:</strong> {user?.name}
                            </div>
                            <div className="p-col-12">
                                <strong>Email:</strong> {user?.email}
                            </div>
                            <div className="p-col-12">
                                <strong>Status:</strong> {user?.status}
                            </div>
                            <div className="p-col-12">
                                <strong>Last Login:</strong> {user?.lastlogin}
                            </div>
                            <div className="p-col-12">
                                <strong>Phone:</strong> {user?.phone}
                            </div>
                            <div className="p-col-12">
                                <strong>NIN:</strong> {user?.nin}
                            </div>
                            <div className="p-col-12">
                                <strong>Agree:</strong> {user?.agree ? "Yes" : "No"}
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>

            <div className="p-grid">
                <div className="p-col-12">
                    <Panel header="Additional Information" toggleable>
                        <div className="p-grid p-2">
                            <div className="p-col-12 p-md-6">
                                <strong>Cloudinary Photo Public ID:</strong> {user?.cloudinary_photo_public_id}
                            </div>
                            <div className="p-col-12 p-md-6">
                                <strong>Created By:</strong> {user?.created_by?.name}
                            </div>
                            <div className="p-col-12 p-md-6">
                                <strong>Updated By:</strong> {user?.updated_by?.name}
                            </div>
                            <div className="p-col-12 p-md-6">
                                <strong>Created At:</strong> {moment(user?.created_at).format("YYYY-MM-DD HH:mm:ss")}
                            </div>
                            <div className="p-col-12 p-md-6">
                                <strong>Updated At:</strong> {moment(user?.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>

            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
                <Button label="Close" icon="pi pi-times" onClick={handleCloseModal} className="p-button-outlined p-button-secondary" />
            </div>
        </Dialog>
    );
}

export default UserDetailsPage;
