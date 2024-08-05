import axiosAPI from "../axiosApi";

export async function getAllVillagePopulationCensus(params = {}) {
    const response = await axiosAPI.get("village-population-census", { params: params });
    return response;
}

export async function getVillagePopulationCensusById(id) {
    const response = await axiosAPI.get(`village-population-census/${id}`);
    return response;
}

export async function postVillagePopulationCensus(data) {
    const response = await axiosAPI.post(`village-population-census`, data);
    return response;
}

export async function updateVillagePopulationCensus(id, data) {
    const response = await axiosAPI.put(`village-population-census/${id}`, data);
    return response;
}

export async function deleteVillagePopulationCensusById(id) {
    const response = await axiosAPI.delete(`village-population-census/${id}`);
    return response;
}
