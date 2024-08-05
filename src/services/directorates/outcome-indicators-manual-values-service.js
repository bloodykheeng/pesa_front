import axiosAPI from "../axiosApi";

export async function getAllOutcomeIndicatorManualValues(params = {}) {
    const response = await axiosAPI.get("outcome-indicator-manual-values", { params: params });
    return response;
}

export async function getOutcomeIndicatorManualValuesById(id) {
    const response = await axiosAPI.get(`outcome-indicator-manual-values/${id}`);
    return response;
}

export async function postOutcomeIndicatorManualValues(data) {
    const response = await axiosAPI.post(`outcome-indicator-manual-values`, data);
    return response;
}

export async function updatOutcomeIndicatorManualValues(id, data) {
    const response = await axiosAPI.put(`outcome-indicator-manual-values/${id}`, data);
    return response;
}

export async function deleteOutcomeIndicatorManualValuesById(id) {
    const response = await axiosAPI.delete(`outcome-indicator-manual-values/${id}`);
    return response;
}
