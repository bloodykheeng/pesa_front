import axiosAPI from "../axiosApi";

export async function getAllOutputIndicatorTypes(params = {}) {
    const response = await axiosAPI.get("output-indicator-types", { params: params });
    return response;
}

export async function getOutputIndicatorTypesById(id) {
    const response = await axiosAPI.get(`output-indicator-types/${id}`);
    return response;
}

export async function postOutputIndicatorTypes(data) {
    const response = await axiosAPI.post(`output-indicator-types`, data);
    return response;
}

export async function updateOutputIndicatorTypes(id, data) {
    const response = await axiosAPI.put(`output-indicator-types/${id}`, data);
    return response;
}

export async function deleteOutputIndicatorTypesById(id) {
    const response = await axiosAPI.delete(`output-indicator-types/${id}`);
    return response;
}
