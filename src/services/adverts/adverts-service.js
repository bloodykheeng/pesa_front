import axiosAPI from "../axiosApi";

export async function getAllAdverts(params = {}) {
    const response = await axiosAPI.get("ads", { params: params });
    return response;
}

export async function getAdvertById(id) {
    const response = await axiosAPI.get(`ads/` + id);
    return response;
}

export async function postAdvert(data) {
    const response = await axiosAPI.post(`ads`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateAdvert(id, data) {
    const response = await axiosAPI.post(`ads/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteAdvertById(id) {
    const response = await axiosAPI.delete(`ads/${id}`);
    return response;
}
