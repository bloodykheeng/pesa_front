import axiosAPI from "../axiosApi";

export async function getAllPackages(params = {}) {
    const response = await axiosAPI.get("packages", { params: params });
    return response;
}

export async function getPackageById(id) {
    const response = await axiosAPI.get(`packages/` + id);
    return response;
}

export async function postPackage(data) {
    const response = await axiosAPI.post(`packages`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updatePackage(id, data) {
    const response = await axiosAPI.post(`packages/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deletePackageById(id) {
    const response = await axiosAPI.delete(`packages/${id}`);
    return response;
}
