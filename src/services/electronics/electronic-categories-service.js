import axiosAPI from "../axiosApi";

export async function getAllElectronicCategories(params = {}) {
    const response = await axiosAPI.get("electronic-categories", { params: params });
    return response;
}

export async function getElectronicCategorieById(id) {
    const response = await axiosAPI.get(`electronic-categories/` + id);
    return response;
}

export async function postElectronicCategorie(data) {
    const response = await axiosAPI.post(`electronic-categories`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateElectronicCategorie(id, data) {
    const response = await axiosAPI.post(`electronic-categories/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteElectronicCategorieById(id) {
    const response = await axiosAPI.delete(`electronic-categories/${id}`);
    return response;
}
