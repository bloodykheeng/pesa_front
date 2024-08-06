import axiosAPI from "../axiosApi";

export async function getAllProductCategories(params = {}) {
    const response = await axiosAPI.get("product-categories", { params: params });
    return response;
}

export async function getProductCategorieById(id) {
    const response = await axiosAPI.get(`product-categories/` + id);
    return response;
}

export async function postProductCategorie(data) {
    const response = await axiosAPI.post(`product-categories`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateProductCategorie(id, data) {
    const response = await axiosAPI.post(`product-categories/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteProductCategorieById(id) {
    const response = await axiosAPI.delete(`product-categories/${id}`);
    return response;
}
