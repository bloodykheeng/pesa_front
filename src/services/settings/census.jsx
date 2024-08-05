import axiosAPI from "../axiosApi";

export async function getAllCensus(params = {}) {
    const response = await axiosAPI.get("census", { params: params });
    return response;
}

export async function getCensusById(id) {
    const response = await axiosAPI.get(`census/${id}`);
    return response;
}

export async function postCensus(data) {
    const response = await axiosAPI.post(`census`, data);
    return response;
}

export async function updateCensus(id, data) {
    const response = await axiosAPI.put(`census/${id}`, data);
    return response;
}

export async function deleteCensusById(id) {
    const response = await axiosAPI.delete(`census/${id}`);
    return response;
}
