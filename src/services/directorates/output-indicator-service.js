import axiosAPI from "../axiosApi";

export async function getAllOutputIndicators(params = {}) {
    const response = await axiosAPI.get("outputIndicators", { params: params });
    return response;
}

export async function getOutputIndicatorById(id) {
    const response = await axiosAPI.get(`outputIndicators/${id}`);
    return response;
}

export async function postOutputIndicator(data) {
    const response = await axiosAPI.post(`outputIndicators`, data);
    return response;
}

export async function updateOutputIndicator(id, data) {
    const response = await axiosAPI.put(`outputIndicators/${id}`, data);
    return response;
}

export async function deleteOutputIndicatorById(id) {
    const response = await axiosAPI.delete(`outputIndicators/${id}`);
    return response;
}
