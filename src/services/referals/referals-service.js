import axiosAPI from "../axiosApi";

export async function getAllReferals(params = {}) {
    const response = await axiosAPI.get("referals", { params: params });
    return response;
}

export async function getReferalById(id) {
    const response = await axiosAPI.get(`referals/` + id);
    return response;
}

export async function postReferal(data) {
    const response = await axiosAPI.post(`referals`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateReferal(id, data) {
    const response = await axiosAPI.post(`referals/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteReferalById(id) {
    const response = await axiosAPI.delete(`referals/${id}`);
    return response;
}
