import axiosAPI from "../axiosApi";

export async function getAllDirectorates(params = {}) {
    const response = await axiosAPI.get("directorates", { params: params });
    return response;
}

export async function getDirectorateById(id) {
    const response = await axiosAPI.get(`directorates/` + id);
    return response;
}

export async function postDirectorate(data) {
    const response = await axiosAPI.post(`directorates`, data);
    return response;
}

export async function updateDirectorate(id, data) {
    const response = await axiosAPI.put(`directorates/${id}`, data);
    return response;
}

export async function deleteDirectorateById(id) {
    const response = await axiosAPI.delete(`directorates/${id}`);
    return response;
}
