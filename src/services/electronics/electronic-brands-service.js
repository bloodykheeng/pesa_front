import axiosAPI from "../axiosApi";

export async function getAllElectronicBrands(params = {}) {
    const response = await axiosAPI.get("electronic-brands", { params: params });
    return response;
}

export async function getElectronicBrandById(id) {
    const response = await axiosAPI.get(`electronic-brands/` + id);
    return response;
}

export async function postElectronicBrand(data) {
    const response = await axiosAPI.post(`electronic-brands`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateElectronicBrand(id, data) {
    const response = await axiosAPI.post(`electronic-brands/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteElectronicBrandById(id) {
    const response = await axiosAPI.delete(`electronic-brands/${id}`);
    return response;
}
