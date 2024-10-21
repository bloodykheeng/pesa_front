import axiosAPI from "../axiosApi";

export async function getAllElectronicTypes(params = {}) {
    const response = await axiosAPI.get("electronic-types", { params: params });
    return response;
}

export async function getElectronicTypeById(id) {
    const response = await axiosAPI.get(`electronic-types/` + id);
    return response;
}

export async function postElectronicType(data) {
    const response = await axiosAPI.post(`electronic-types`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateElectronicType(id, data) {
    const response = await axiosAPI.post(`electronic-types/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteElectronicTypeById(id) {
    const response = await axiosAPI.delete(`electronic-types/${id}`);
    return response;
}
