import axiosAPI from "../axiosApi";

export async function getAllMetrics(params = {}) {
    const response = await axiosAPI.get("metric", { params: params });
    return response;
}

export async function getMetricById(id) {
    const response = await axiosAPI.get(`metric/${id}`);
    return response;
}

export async function postMetric(data) {
    const response = await axiosAPI.post(`metric`, data);
    return response;
}

export async function updateMetric(id, data) {
    const response = await axiosAPI.put(`metric/${id}`, data);
    return response;
}

export async function deleteMetricById(id) {
    const response = await axiosAPI.delete(`metric/${id}`);
    return response;
}
