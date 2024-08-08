import axiosAPI from "../axiosApi";

export async function getAllCategoryBrandOptions(params = {}) {
    const response = await axiosAPI.get("category-brand-options", { params: params });
    return response;
}

export async function getCategoryBrandOptionById(id) {
    const response = await axiosAPI.get(`category-brand-options/` + id);
    return response;
}

export async function postCategoryBrandOption(data) {
    const response = await axiosAPI.post(`category-brand-options`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateCategoryBrandOption(id, data) {
    const response = await axiosAPI.post(`category-brand-options/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteCategoryBrandOptionById(id) {
    const response = await axiosAPI.delete(`category-brand-options/${id}`);
    return response;
}
