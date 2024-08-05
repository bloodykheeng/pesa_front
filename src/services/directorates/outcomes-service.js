import axiosAPI from "../axiosApi";

export async function getAllOutcomes(params = {}) {
    const response = await axiosAPI.get("outcomes", { params: params });
    return response;
}

export async function getOutcomeById(id) {
    const response = await axiosAPI.get(`outcomes/${id}`);
    return response;
}

export async function postOutcome(data) {
    const response = await axiosAPI.post(`outcomes`, data);
    return response;
}

export async function updateOutcome(id, data) {
    const response = await axiosAPI.put(`outcomes/${id}`, data);
    return response;
}

export async function deleteOutcomeById(id) {
    const response = await axiosAPI.delete(`outcomes/${id}`);
    return response;
}
