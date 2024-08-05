import axiosAPI from "../axiosApi";

export async function getAllOutcomeIndicators(params = {}) {
    const response = await axiosAPI.get("outcomeIndicator", { params: params });
    return response;
}

export async function getOutcomeIndicatorById(id) {
    const response = await axiosAPI.get(`outcomeIndicator/${id}`);
    return response;
}

export async function postOutcomeIndicator(data) {
    const response = await axiosAPI.post(`outcomeIndicator`, data);
    return response;
}

export async function updateOutcomeIndicator(id, data) {
    const response = await axiosAPI.put(`outcomeIndicator/${id}`, data);
    return response;
}

export async function deleteOutcomeIndicatorById(id) {
    const response = await axiosAPI.delete(`outcomeIndicator/${id}`);
    return response;
}
