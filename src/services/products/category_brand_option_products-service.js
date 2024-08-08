import axiosAPI from "../axiosApi";

export async function getAllCategoryBrandOptionProducts(params = {}) {
    const response = await axiosAPI.get("category-brand-option-products", { params: params });
    return response;
}

export async function getCategoryBrandOptionProductById(id) {
    const response = await axiosAPI.get(`category-brand-option-products/` + id);
    return response;
}

export async function postCategoryBrandOptionProduct(data) {
    const response = await axiosAPI.post(`category-brand-option-products`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateCategoryBrandOptionProduct(id, data) {
    const response = await axiosAPI.post(`category-brand-option-products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteCategoryBrandOptionProductById(id) {
    const response = await axiosAPI.delete(`category-brand-option-products/${id}`);
    return response;
}
