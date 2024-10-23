import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreateForm from "./CreateForm";

import EditForm from "./EditForm";

import moment from "moment";

import { useNavigate } from "react-router-dom";

import { getAllProducts, getProductById, postProduct, updateProduct, deleteProductById } from "../../services/products/products-service";
import { getAllProductTypes, getProductTypeById, postProductType, updateProductType, deleteProductTypeById } from "../../services/products/product-types-service";

import { Dropdown } from "primereact/dropdown";
import MuiTable from "../../components/general_components/MuiTable";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Panel } from "primereact/panel";
import { Image } from "primereact/image";
import { ProgressSpinner } from "primereact/progressspinner";

import useHandleQueryError from "../../hooks/useHandleQueryError";
import handleMutationError from "../../hooks/handleMutationError";
function ListPage({ loggedInUserData, electronicTypeData, productCategoryBrandData, ...props }) {
    const navigate = useNavigate();

    const [selectedProductType, setSelectedProductType] = useState(null);

    const queryClient = useQueryClient();
    const { data, isLoading, isError, error, status } = useQuery({
        queryKey: ["products", "by_category_brands_id", productCategoryBrandData?.id, "by_product_type_id", selectedProductType?.id, "by_electronic_type_id", electronicTypeData?.id],
        queryFn: () => getAllProducts({ category_brands_id: productCategoryBrandData?.id, product_types_id: selectedProductType?.id, electronic_type_id: electronicTypeData?.id }),
    });
    console.log("🚀 ~product sub categories ListPage ~ data:", data);
    // useEffect(() => {
    //     if (isError) {
    //         console.log("Error fetching List of data :", error);
    //         error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
    //     }
    // }, [isError]);

    // Use the custom hook to handle errors with useMemo on the error object
    useHandleQueryError(isError, error);

    const [deleteMutationIsLoading, setDeleteMutationIsLoading] = useState(false);
    const deleteMutation = useMutation({
        mutationFn: (variables) => deleteProductById(variables),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["products"]);
            toast.success("Deleted Successfully");
            setDeleteMutationIsLoading(false);
        },
        onError: (error) => {
            // setDeleteMutationIsLoading(false);
            // error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
            handleMutationError(error, setDeleteMutationIsLoading);
        },
    });

    // const handleDelete = async (event, id) => {
    //     var result = window.confirm("Are you sure you want to delete?");
    //     if (result === true) {
    //         ProgramDeleteMutation.mutate(id);
    //     }
    // };

    const handleDelete = (event, id) => {
        let selectedDeleteId = id;
        confirmDialog({
            message: "Are you sure you want to delete?",
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => confirmDelete(selectedDeleteId),
            reject: cancelDelete,
        });
    };

    const confirmDelete = (selectedDeleteId) => {
        if (selectedDeleteId !== null) {
            setDeleteMutationIsLoading(true);
            deleteMutation.mutate(selectedDeleteId);
        }
    };

    const cancelDelete = () => {
        // setDeleteProgramId(null);
    };

    const [selectedItem, setSelectedItem] = useState();

    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showBudjetOutPutAddForm, setShowBudjetOutPutAddForm] = useState(false);

    const handleShowEditForm = (item) => {
        setSelectedItem(item);
        setShowEditForm(true);
        console.log("handleShowEditForm is : ", item);
    };
    const handleCloseEditForm = () => {
        setSelectedItem({ id: null });
        setShowEditForm(false);
    };

    // const activeUser = localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")) : undefined;
    const activeUser = loggedInUserData;

    const onFormClose = () => {
        setShowAddForm(false);
    };

    const onBudjetOutPutFormClose = () => {
        setShowBudjetOutPutAddForm(false);
    };

    let tableId = 0;
    const columns = [
        {
            title: "#",
            width: "5%",
            field: "id",
        },
        {
            title: "Photo",
            field: "photo_url",
            hidden: false,
            render: (rowData) => {
                return rowData.photo_url ? <Image src={`${process.env.REACT_APP_IMAGE_BASE_URL}${rowData.photo_url}`} alt={rowData.name} height="30" preview style={{ verticalAlign: "middle" }} /> : <div>No Image</div>;
            },
        },
        {
            title: "Name",
            field: "name",
        },

        ...(!electronicTypeData
            ? [
                  {
                      title: "Brand",
                      field: "category_brand.name",
                  },
                  {
                      title: "Type",
                      field: "product_type.name",
                  },
              ]
            : [
                  {
                      title: "Electronic Category",
                      field: "electronic_category.name",
                  },
                  {
                      title: "Electronic Brand",
                      field: "electronic_brand.name",
                  },
                  {
                      title: "Electronic Type",
                      field: "electronic_type.name",
                  },
              ]),
        {
            title: "Inventory Type",
            field: "inventory_type.name",
        },

        {
            title: "Price",
            field: "price",
            render: (rowData) => {
                return rowData.price ? parseFloat(rowData.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "No Price";
            },
        },
        {
            title: "Quantity",
            field: "quantity",
            render: (rowData) => {
                const quantityString = String(rowData.quantity); // Ensure it's a string
                const amount = parseFloat(quantityString.replace(/,/g, ""));
                return <div>{isNaN(amount) ? rowData.quantity : amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>;
            },
        },

        // {
        //     title: "Photo",
        //     field: "cloudinary_photo_url",
        //     render: (rowData) => {
        //         return rowData.cloudinary_photo_url ? <Image src={`${rowData.cloudinary_photo_url}`} alt={rowData.name} height="30" preview style={{ verticalAlign: "middle" }} /> : <div>No Image</div>;
        //     },
        // },

        {
            title: "Date",
            field: "created_at",
            hidden: true,
            render: (rowData) => {
                return moment(rowData.created_at).format("lll");
            },
        },

        {
            title: "Created By Name",
            field: "created_by.name",
            hidden: true,
        },
        {
            title: "Created By Email",
            field: "created_by.email",
            hidden: true,
        },
        {
            title: "Details",
            field: "details",
            hidden: true,
        },
    ];

    //==================== get all product types ====================

    // Handler for dropdown change
    const handleProductTypeChange = (e) => {
        setSelectedProductType(e.value);
    };
    const getAllProductTypesQuery = useQuery({
        queryKey: ["product-types"],
        queryFn: getAllProductTypes,
    });

    // useEffect(() => {
    //     if (getAllProductTypesQuery?.isError) {
    //         console.log("Error fetching List of user roles data:", getAllProductTypesQuery?.error);
    //         getAllProductTypesQuery?.error?.response?.data?.message ? toast.error(getAllProductTypesQuery?.error?.response?.data?.message) : !getAllProductTypesQuery?.error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occurred Please Contact Admin");
    //     }
    // }, [getAllProductTypesQuery?.isError]);

    // Use the custom hook to handle errors with useMemo on the error object
    useHandleQueryError(getAllProductTypesQuery?.isError, getAllProductTypesQuery?.error);

    return (
        <div style={{ width: "100%" }}>
            {/* <div className="col-12 xl:col-12">
                <div className="card">
                    <p>Funders Are Attched onto subprojects</p>
                </div>
            </div> */}
            <Panel header="Products" style={{ marginBottom: "20px" }} toggleable>
                <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                    {activeUser?.permissions.includes("create") && <Button label="Add Product" className="p-button-primary" onClick={() => setShowAddForm(true)} />}
                    <CreateForm show={showAddForm} onHide={() => setShowAddForm(false)} onClose={onFormClose} electronicTypeData={electronicTypeData} productCategoryBrandData={productCategoryBrandData} />
                </div>

                {!electronicTypeData && (
                    <div className="p-field m-4">
                        {/* <label htmlFor="role">Role</label> */}
                        <Dropdown
                            value={selectedProductType}
                            options={[{ label: "All", value: null }, ...(getAllProductTypesQuery?.data?.data?.data?.map((type) => ({ label: type?.name, value: type })) || [])]}
                            onChange={handleProductTypeChange}
                            placeholder="Filter By Type"
                            disabled={getAllProductTypesQuery?.isLoading}
                        />
                        {getAllProductTypesQuery.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
                    </div>
                )}

                <MuiTable
                    tableTitle="Products"
                    tableData={data?.data?.data ?? []}
                    tableColumns={columns}
                    handleShowEditForm={handleShowEditForm}
                    handleDelete={(e, item_id) => handleDelete(e, item_id)}
                    showEdit={activeUser?.permissions.includes("update")}
                    showDelete={activeUser?.permissions.includes("delete")}
                    loading={isLoading || status === "loading" || deleteMutationIsLoading}
                    // //
                    // handleViewPage={(rowData) => {
                    //     navigate("product-category-brand", { state: { productCategoryBrandData: rowData } });
                    // }}
                    // showViewPage={true}
                    // hideRowViewPage={false}
                    //
                    exportButton={true}
                    pdfExportTitle="Products"
                    csvExportTitle="Products"
                />

                {selectedItem && <EditForm rowData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} />}
            </Panel>
        </div>
    );
}

export default ListPage;
