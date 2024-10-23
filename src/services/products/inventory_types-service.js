import axiosAPI from "../axiosApi";

export async function getAllInventoryTypes(params = {}) {
    const response = await axiosAPI.get("inventory-types", { params: params });
    return response;
}

export async function getInventoryTypeById(id) {
    const response = await axiosAPI.get(`inventory-types/` + id);
    return response;
}

export async function postInventoryType(data) {
    const response = await axiosAPI.post(`inventory-types`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateInventoryType(id, data) {
    const response = await axiosAPI.post(`inventory-types/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteInventoryTypeById(id) {
    const response = await axiosAPI.delete(`inventory-types/${id}`);
    return response;
}
