import axiosAPI from "../axiosApi";

export async function getAllBrandAccessorys(params = {}) {
    const response = await axiosAPI.get("brand-accessories", { params: params });
    return response;
}

export async function getBrandAccessoryById(id) {
    const response = await axiosAPI.get(`brand-accessories/` + id);
    return response;
}

export async function postBrandAccessory(data) {
    const response = await axiosAPI.post(`brand-accessories`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateBrandAccessory(id, data) {
    const response = await axiosAPI.post(`brand-accessories/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteBrandAccessoryById(id) {
    const response = await axiosAPI.delete(`brand-accessories/${id}`);
    return response;
}
